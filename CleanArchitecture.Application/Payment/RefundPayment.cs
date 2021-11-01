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
    public class RefundPayment
    {
        public class Command : IRequest<RefundDto>
        {
           
            public string paymentTransactionId { get; set; }
            public Guid activityId { get; set; }
            public Guid orderId { get; set; }

            public string UserIpAddress { get; set; }
        }


        public class Handler : IRequestHandler<Command, RefundDto>
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

            public async Task<RefundDto> Handle(Command request, CancellationToken cancellationToken)
            {

                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "NotFound currentUser" });

                var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == request.orderId);

                if (order == null || order.OrderItems.Count == 0)
                    throw new RestException(HttpStatusCode.BadRequest, new { Order = "Not Found order" });

                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.activityId);
               
                if (activity == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Activity = "Not Found activity" });

                var orderItem = order.OrderItems.FirstOrDefault();

                if(orderItem.ActivityId != activity.Id)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Activity = "Ödemesi yapılan aktivite değil." });
                }

              
                var refundRes = _paymentAccessor.IyzicoRefund(orderItem.PaymentTransactionId, order.PaidPrice, request.UserIpAddress);

                if(refundRes.Status == "success")
                {
                    var attendance = await _context.UserActivities.SingleOrDefaultAsync(x =>
                          x.ActivityId == activity.Id && x.AppUserId == currentUser.Id);

                    if (attendance == null)
                        return refundRes;

                    _context.UserActivities.Remove(attendance);
                    order.OrderState = EnumOrderState.Cancelled;
                    var success = await _context.SaveChangesAsync() > 0;
                }
                return refundRes;

            }
        }
    }
}
