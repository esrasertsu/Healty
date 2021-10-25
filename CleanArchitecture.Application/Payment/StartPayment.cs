using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
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

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
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

                //activite katılımcı sayısını güncelle
                if (activity.AttendancyLimit != null && activity.AttendancyLimit > 0)
                {
                    var atcount = activity.AttendanceCount + request.TicketCount;
                    if (atcount > activity.AttendancyLimit)
                        throw new RestException(HttpStatusCode.BadRequest, new { Activity = "Katılımcı sayısı doldu. Lütfen aktivite sahibiyle iletişime geçin." });
                }
                //var userSameActivityOrders = user.Orders.Where(x => x.OrderItems.Any(y => y.ActivityId == activity.Id)).ToList();
                //if (userSameActivityOrders.Any(x=> x.OrderState== EnumOrderState.Unpaid))
                //{
                //    throw new Exception("Bu aktivite için ödenmemiş sipariş bulunmakta. Lütfen 'siparişlerim' sayfasını kontrol edin.");
                //}

                var lastOrder = await _context.Orders.FirstOrDefaultAsync(p => p.OrderNumber == _context.Orders.Max(x => x.OrderNumber));

                //order yarat
                var order = new Order();

                order.OrderNumber = lastOrder != null ? lastOrder.OrderNumber + 1 : 1;
                order.OrderState = EnumOrderState.Unpaid;
                order.PaymentType = EnumPaymentTypes.Creditcard;
                order.OrderDate = DateTime.Now;
                order.FirstName = user.Name;
                order.LastName = user.Surname;
                order.Email = user.Email;
                order.Phone = user.PhoneNumber;
                order.UserId = user.Id;
                order.ConversationId = order.OrderNumber.ToString();
                order.User = user;
                order.UserId = user.Id;

                var orderItem = new OrderItem()
                {
                    Price = activity.Price.Value,
                    Quantity = request.TicketCount,
                    ActivityId = activity.Id,
                    Activity = activity
                };
                order.OrderItems.Add(orderItem);

                if (user.HasSignedIyzicoContract == false)
                {
                    user.HasSignedIyzicoContract = request.HasSignedIyzicoContract;
                    user.IyzicoContractSignedDate = DateTime.Now;
                }
                if (user.HasSignedPaymentContract == false)
                {
                    user.HasSignedPaymentContract = request.HasSignedPaymentContract;
                    user.PaymentSignedDate = DateTime.Now;
                }

                user.Orders.Add(order);

                try
                {
                    var orderCreatedSuccess = await _context.SaveChangesAsync() > 0;

                    if (orderCreatedSuccess)
                    {
                        activity.AttendanceCount = activity.AttendanceCount + request.TicketCount;

                        var subMerchantKey = activity.UserActivities.Where(x => x.IsHost == true).Select(y => y.AppUser.SubMerchantKey).SingleOrDefault().ToString();
                        var subMerchant = activity.UserActivities.Where(x => x.IsHost == true).Select(y => y.AppUser.SubMerchantDetails).SingleOrDefault();

                        var IyzicoMerchant = _paymentAccessor.GetSubMerchantFromIyzico(subMerchant.Id.ToString());

                        if (IyzicoMerchant.Status == false || IyzicoMerchant.SubMerchantKey == "" || IyzicoMerchant.SubMerchantKey == null)
                        {
                            if(subMerchantKey != "" || subMerchantKey != null)
                            {
                                throw new Exception("Problem getting merchant from Iyzico. Please contact System Manager");
                            }

                            //kendim alıyorum
                        }
                        else
                        {
                            if(subMerchantKey != IyzicoMerchant.SubMerchantKey)
                                throw new Exception("Problem with Iyzico merchantKey and system key. Please contact System Manager");

                            var callbackUrl = $"{request.Origin}/api/payment/callback/"+activity.Id+"/"+request.TicketCount+ "?id=" + activity.Id + "&count=" + request.TicketCount+"";
                            var paymentStartedRes = _paymentAccessor.PaymentProcessWithIyzico(activity, user, request.TicketCount, request.UserIpAddress,
                            order.ConversationId, request.CardHolderName, request.CardNumber, request.CVC, request.ExpireMonth, request.ExpireYear, subMerchantKey, callbackUrl);

                            if (paymentStartedRes != "false")
                            {
                                return new PaymentThreeDResult() {
                                   Status= true,
                                   ContentHtml = paymentStartedRes
                                };
                            }else
                            {
                                throw new Exception("Problem with data sending to Iyzico");
                            }
                        }
                        

                    }
                    else
                    {
                        throw new Exception("Problem creating order data");
                    }
                }
                catch (Exception ex)
                {

                    throw new Exception(ex.Message);
                }
               

                //order yarat statüsü notpaid olan
                //ödemeyi başlat
                //sonucu ekrana dön ve order statüsü güncelle
                //eğer sonuç başarılı ise kullanıcı attend et

                throw new Exception("Problem getting 3D page");

            }
        }
    }
}
