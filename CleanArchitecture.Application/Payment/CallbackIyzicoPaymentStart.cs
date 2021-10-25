using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Payment
{
    public class CallbackIyzicoPaymentStart
    {
        public class Command : IRequest<bool>
        {
            public string status { get; set; }
            public string paymentId { get; set; }
            public string conversationData { get; set; }
            public long conversationId { get; set; }
            public string mdStatus { get; set; }
            public Guid Id { get; set; }
            public int count { get; set; }
        }


        public class Handler : IRequestHandler<Command, bool>
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

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                if(request.status == "failure")
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Iyzico = request.mdStatus.ToString() });
                }
                else
                {
                     var order = await _context.Orders.SingleOrDefaultAsync(x => x.OrderNumber == request.conversationId);
                    var paymentId = _paymentAccessor.FinishPaymentWithIyzico(request.conversationId.ToString(), request.paymentId, request.conversationData);
                  
                        order.OrderState = Domain.EnumOrderState.Completed;
                        order.PaymentId = paymentId;

                        var orderStateChanged = await _context.SaveChangesAsync() > 0;
                        return true;

                    
                 
                }
            }
        }
    }
}
