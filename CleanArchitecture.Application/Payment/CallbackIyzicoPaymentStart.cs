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

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
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

                        var item = order.OrderItems.FirstOrDefault(x => x.ActivityId == new Guid(iyzicoPaymentResult.ItemId));
                        item.PaymentTransactionId = iyzicoPaymentResult.PaymentTransactionId;

                        var user = await _context.Users.SingleOrDefaultAsync(x =>
                          x.Id == request.uid);
                        
                        if (user != null)
                        {
                            var activity = await _context.Activities.FindAsync(request.Id);

                            if (activity == null)
                                throw new RestException(HttpStatusCode.NotFound,
                                    new { Activity = "Couldn't find activity" });

                            var attendance = await _context.UserActivities.SingleOrDefaultAsync(x =>
                               x.ActivityId == request.Id && x.AppUserId == user.Id);

                            if (attendance != null)
                                throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Already attending this activity" });

                            attendance = new UserActivity
                            {
                                Activity = activity,
                                AppUser = user,
                                IsHost = false,
                                DateJoined = DateTime.Now,
                                ShowName = true
                            };

                            _context.UserActivities.Add(attendance);
                        }

                        var orderStateChanged = await _context.SaveChangesAsync() > 0;

                        if (orderStateChanged)
                            return iyzicoPaymentResult;
                        else throw new RestException(HttpStatusCode.BadRequest, new { OrderState = "Order state and activity cannot changed" });

                    }
                    else
                    {
                        order.OrderState = Domain.EnumOrderState.Failed;
                        await _context.SaveChangesAsync();
                    }

                    return iyzicoPaymentResult;

                }
            }
        }
    }
}
