using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.Orders
{
    public class PaymentDisapprove
    {
        public class Command : IRequest
        {
            public string PaymentTransactionId { get; set; }
            public Guid OrderItemId { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPaymentAccessor _paymentAccessor;

            public Handler(DataContext context, IPaymentAccessor paymentAccessor)
            {
                _context = context;
                _paymentAccessor = paymentAccessor;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {


                if (string.IsNullOrEmpty(request.PaymentTransactionId))
                    throw new RestException(HttpStatusCode.NotFound, new { Review = "Not Found" });

               
                var orderItem = await _context.OrderItems.SingleOrDefaultAsync(x => x.Id == request.OrderItemId);

                if (orderItem == null)
                    throw new RestException(HttpStatusCode.NotFound, new { orderItem = "Not Found" });


                var result = _paymentAccessor.IyzicoPaymentDisapprove(request.PaymentTransactionId);


                    if (string.IsNullOrEmpty(result.ErrorMessage) && string.IsNullOrEmpty(result.ErrorCode))
                    {
                        orderItem.AdminPaymentApproved = EnumOrderItemApproveState.Disapproved;
                        orderItem.AdminPaymentDisapprovedDate = DateTime.Now;

                    var success = await _context.SaveChangesAsync() > 0;

                        if (success) return Unit.Value;
                        else throw new Exception("Problem saving changes on DB");
                    }
                    else
                    {
                        throw new Exception(result.ErrorMessage + "," + result.ErrorGroup + "," + result.ErrorCode);
                    }
               

            }
        }
    }
}
