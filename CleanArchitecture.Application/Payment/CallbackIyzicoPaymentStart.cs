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
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Payment
{
    public class CallbackIyzicoPaymentStart
    {
        public class Command : IRequest<IyzicoPaymentResult>
        {
            public string status { get; set; }
            public string paymentId { get; set; }
            public string conversationData { get; set; }
            public long conversationId { get; set; }
            public string mdStatus { get; set; }
            public Guid Id { get; set; }
            public int count { get; set; }
            public string uid { get; set; }
        }


        public class Handler : IRequestHandler<Command, IyzicoPaymentResult>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IEmailSender _emailSender;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor, IEmailSender emailSender)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
                 _emailSender = emailSender;
        }

            public async Task<IyzicoPaymentResult> Handle(Command request, CancellationToken cancellationToken)
            {
                if(request.status == "failure")
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Iyzico = request.mdStatus.ToString() });
                }
                else
                {
                     var order = await _context.Orders.SingleOrDefaultAsync(x => x.OrderNumber == request.conversationId);
                    var iyzicoPaymentResult = _paymentAccessor.FinishPaymentWithIyzico(request.conversationId.ToString(), request.paymentId, request.conversationData);
                  
                    if(iyzicoPaymentResult.Status =="success")
                    {
                        order.OrderState = Domain.EnumOrderState.Completed;
                        order.PaymentId = iyzicoPaymentResult.PaymentId;
                        order.PaymentType = iyzicoPaymentResult.CardType;
                        order.CardFamily = iyzicoPaymentResult.CardFamily;
                        order.CardAssociation = iyzicoPaymentResult.CardAssociation;
                        order.PaidPrice = iyzicoPaymentResult.PaidPrice;
                        order.Currency = iyzicoPaymentResult.Currency;
                        var contract = await _context.Contracts.FirstOrDefaultAsync(p => p.Status && p.Code == "MSS");
                        if (contract != null)
                        {
                            order.ContractId = contract.Id.ToString();
                        }

                        var item = order.OrderItems.FirstOrDefault(x => x.ActivityId == new Guid(iyzicoPaymentResult.ItemId));
                        item.PaymentTransactionId = iyzicoPaymentResult.PaymentTransactionId;

                        var user = await _context.Users.SingleOrDefaultAsync(x =>
                          x.Id == request.uid);
                        
                        var activity = await _context.Activities.FindAsync(request.Id);

                        var attendance = await _context.UserActivities.SingleOrDefaultAsync(x =>
                            x.ActivityId == request.Id && x.AppUserId == user.Id);

                        //if (attendance != null)
                        //    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Already attending this activity" });
                        activity.AttendanceCount = activity.AttendanceCount + request.count;

                        attendance = new UserActivity
                        {
                            Activity = activity,
                            AppUser = user,
                            IsHost = false,
                            DateJoined = DateTime.Now,
                            ShowName = true
                        };

                            _context.UserActivities.Add(attendance);

                        if (contract != null)
                        {
                            var trainer = activity.UserActivities.FirstOrDefault(x => x.IsHost);
                            var userSellContract = new UserSellContract();
                            userSellContract.TrainerId = trainer.AppUserId;
                            userSellContract.UserId = user.Id;
                            userSellContract.UserName = user.Name + " "+ user.Surname;
                            userSellContract.TrainerName = trainer.AppUser.SubMerchantDetails.Name;
                            userSellContract.ActivityId = activity.Id.ToString();
                            userSellContract.ActivityName = activity.Title;
                            userSellContract.ContractId = contract.Id.ToString();
                        }

                        //var message = $"<p>Merhaba,</p><p>Email adresini aşağıdaki linke tıklayarak doğrulayabilir ve siteye giriş yapabilirsiniz.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";

                        //await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", message);

                        var orderStateChanged = await _context.SaveChangesAsync() > 0;

                        if (!orderStateChanged)
                        {
                            iyzicoPaymentResult.ErrorCode = "9999";
                            iyzicoPaymentResult.ErrorMessage = "Ödeme alındı ancak sipariş bilgisi ve/veya aktivite bilgileri sistem üzerinde güncellenemedi. Lütfen bizimle iletişime geçin.";
                        }
                        string FilePath = Directory.GetCurrentDirectory() + "/Templates/RezervationTemplate.html";
                        StreamReader str = new StreamReader(FilePath);
                        string MailText = str.ReadToEnd();
                        str.Close();
                        MailText = MailText.Replace("[activityUrl]", $"https://afitapp.com/activities/{activity.Id}")
                            .Replace("[activityImage]", activity.Photos.SingleOrDefault(x => x.IsMain)?.Url)
                            .Replace("[ActivityTitle]", activity.Title)
                            .Replace("[ActivityDescription]", activity.Description.Length > 50 ? activity.Description.Substring(0, 50) : activity.Description)
                            .Replace("[ItemCount]", request.count.ToString())
                            .Replace("[OrderPrice]", RemoveTrailingZeros((order.PaidPrice).ToString().Split(',')[0])+" TL");

                        await _emailSender.SendEmailAsync(user.Email, "Rezervasyon Bilgileri", MailText);

                        //email atabilirsin sözleşmeyi

                        return iyzicoPaymentResult;

                    }
                    else
                    {
                        order.OrderState = Domain.EnumOrderState.Failed;
                        await _context.SaveChangesAsync();
                    }

                    return iyzicoPaymentResult;

                }
            }

            private string RemoveTrailingZeros(string strPrice)
            {
                return strPrice.Contains(".") ? strPrice.TrimEnd('0').TrimEnd('.') : strPrice;
            }
        }
    }
}
