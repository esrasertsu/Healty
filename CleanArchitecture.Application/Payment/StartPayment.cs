using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.SubMerchants;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Payment
{
    public class StartPayment
    {
        public class Query : IRequest<PaymentThreeDResult>
        {
            public string CardNumber { get; set; }
            public string CardHolderName { get; set; }
            public string CVC { get; set; }
            public string ExpireDate { get; set; }
            public string ExpireYear { get; set; }
            public string ExpireMonth { get; set; }
            public bool HasSignedPaymentContract { get; set; }
            public bool HasSignedIyzicoContract { get; set; }
            public Guid ActivityId { get; set; }
            public int TicketCount { get; set; }
            public string UserIpAddress { get; set; }
            public string Origin { get; set; }

        }

        public class Handler : IRequestHandler<Query, PaymentThreeDResult>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IUserCultureInfo _userCultureInfo;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, UserManager<AppUser> userManager,
                IHttpContextAccessor httpContextAccessor, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
                _userCultureInfo = userCultureInfo;
                _userManager = userManager;
            }
            public async Task<PaymentThreeDResult> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                //
                if (activity.AttendancyLimit != null && activity.AttendancyLimit > 0)
                {
                    var atcount = activity.AttendanceCount + request.TicketCount;
                    if (atcount > activity.AttendancyLimit)
                        throw new RestException(HttpStatusCode.BadRequest, new { Activity = "Katılımcı sayısı doldu. Lütfen aktivite sahibiyle iletişime geçin." });
                }

                var lastOrder = await _context.Orders.FirstOrDefaultAsync(p => p.OrderNumber == _context.Orders.Max(x => x.OrderNumber));

                //order yarat
                var order = new Order();

                order.OrderNumber = lastOrder != null ? lastOrder.OrderNumber + 1 : 1;
                order.OrderState = EnumOrderState.Unpaid;
                order.OrderDate = _userCultureInfo.GetUserLocalTime();
                order.FirstName = user.Name;
                order.LastName = user.Surname;
                order.Email = user.Email;
                order.Phone = user.PhoneNumber;
                order.UserId = user.Id;
                order.ConversationId = order.OrderNumber.ToString();
                order.User = user;
                order.BuyerName = request.CardHolderName;
                var cardLength = request.CardNumber.Replace(" ","").Length;
                order.CardLastFourDigit = request.CardNumber.Substring(cardLength - 4, 4);
     
                var orderItem = new OrderItem()
                {
                    Price = activity.Price.Value,
                    Quantity = request.TicketCount,
                    ActivityId = activity.Id,
                    Activity = activity,
                    AdminPaymentApproved = EnumOrderItemApproveState.Waiting
                };
                order.OrderItems.Add(orderItem);

                if (user.HasSignedIyzicoContract == false)
                {
                    user.HasSignedIyzicoContract = request.HasSignedIyzicoContract;
                    user.IyzicoContractSignedDate = _userCultureInfo.GetUserLocalTime();
                }
                if (user.HasSignedPaymentContract == false)
                {
                    user.HasSignedPaymentContract = request.HasSignedPaymentContract;
                    user.PaymentSignedDate = _userCultureInfo.GetUserLocalTime();
                }

                user.Orders.Add(order);

                try
                {
                    var orderCreatedSuccess = await _context.SaveChangesAsync() > 0;

                    if (orderCreatedSuccess)
                    {
                        var ownerTrainer = activity.UserActivities.Where(x => x.IsHost == true).Select(y => y.AppUser).SingleOrDefault();
                        var subMerchantKey = "";
                        var subMerchant = new SubMerchant();

                        //Aktivite açan hoca şirket mi değil mi kontrol ediliyor bilgisi alınıyor
                        if (ownerTrainer != null)
                        {
                            subMerchantKey = ownerTrainer.SubMerchantKey;
                            subMerchant = ownerTrainer.SubMerchantDetails;
                        }
                        //

                        //Aktivite sahibi kişinin şirket ise Iyzico sistemindeki durumu kontrol ediliyor
                        if (!string.IsNullOrEmpty(subMerchantKey))
                        {
                            var IyzicoMerchant = _paymentAccessor.GetSubMerchantFromIyzico(subMerchant.Id.ToString());
                            
                            if (IyzicoMerchant.Status == false || string.IsNullOrEmpty(IyzicoMerchant.SubMerchantKey) || subMerchantKey != IyzicoMerchant.SubMerchantKey)
                            {
                                // throw new Exception("Problem getting merchant from Iyzico. Please contact System Manager");
                                subMerchantKey = "";

                            }
                        }

                        if (string.IsNullOrEmpty(subMerchantKey))
                        {
                            //throw new Exception("Aktivite sahibi sistem bilgileri eksik");
                            var systemMerchant = await _context.SubMerchants.FirstOrDefaultAsync(x => x.User == ownerTrainer);

                            if(systemMerchant == null)
                                throw new Exception("Aktivite sahibi bilgileri eksik. Admin veya eğitmen ile iletişime geçiniz.");

                            IyziSubMerchantResponse newIyzicoMerchant = _paymentAccessor.CreateSubMerchantIyzico(systemMerchant);

                            if (newIyzicoMerchant.Status)
                            {

                                subMerchant.SubMerchantKey = newIyzicoMerchant.SubMerchantKey;
                                subMerchant.Status = true;
                                subMerchant.ApplicationDate = _userCultureInfo.GetUserLocalTime();
                                subMerchant.LastEditDate = _userCultureInfo.GetUserLocalTime();
                                var editedSubMerchant = await _context.SaveChangesAsync() > 0;

                                if (editedSubMerchant)
                                {
                                    ownerTrainer.SubMerchantKey = newIyzicoMerchant.SubMerchantKey;
                                    ownerTrainer.LastProfileUpdatedDate = _userCultureInfo.GetUserLocalTime();
                                    await _userManager.UpdateAsync(ownerTrainer);

                                }
                                else
                                {
                                    throw new Exception("Problem editing subMerchant Key on DB");
                                }
                            }
                            else
                            {
                                _context.SubMerchants.Remove(ownerTrainer.SubMerchantDetails);
                                ownerTrainer.SubMerchantKey = "";
                                ownerTrainer.LastProfileUpdatedDate = _userCultureInfo.GetUserLocalTime();
                                await _context.SaveChangesAsync();
                            }
                        }
                        //

                        var callbackUrl = $"{request.Origin}/api/payment/callback/" + activity.Id + "/" + request.TicketCount + "?id=" + activity.Id + "&count=" + request.TicketCount + "&uId=" + user.Id + "";
                               
                        var paymentStartedRes = _paymentAccessor.PaymentProcessWithIyzico(orderItem, user, request.UserIpAddress,
                        order.ConversationId, request.CardHolderName, request.CardNumber.Replace(" ", ""), request.CVC, request.ExpireMonth, request.ExpireYear,
                        subMerchantKey, callbackUrl, ownerTrainer);

                        if (paymentStartedRes.ErrorMessage == "" && paymentStartedRes.ErrorCode == "")
                        {
                            return new PaymentThreeDResult()
                            {
                                Status = true,
                                ContentHtml = paymentStartedRes.ContentHtml
                            };
                        }
                        else
                        {
                            throw new Exception(paymentStartedRes.ErrorMessage + "," + paymentStartedRes.ErrorGroup + "," + paymentStartedRes.ErrorCode + "," + paymentStartedRes.Request );
                        }
                            
                        

                    }
                    else
                    {
                        throw new Exception("Problem creating order data");
                    }
                }
                catch (Exception ex)
                {
                    _context.Orders.Remove(order);
                    await _context.SaveChangesAsync();
                    throw new Exception(ex.Message);
                }

            }
        }
    }
}
