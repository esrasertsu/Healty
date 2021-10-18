using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.UserProfileComments;
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

namespace CleanArchitecture.Application.Activities
{
    public class GetActivityPaymentPage
    {
    
        public class Query : IRequest<string>
        {
            public Guid ActivityId { get; set; }
            public int Count { get; set; }
        }

        public class Handler : IRequestHandler<Query, string>
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
            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                string userIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
             
                //if (Request.Headers.ContainsKey("X-Forwarded-For"))
                //    return Request.Headers["X-Forwarded-For"];
                //else
                //    return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

                var paymentPageContent = _paymentAccessor.GetActivityPaymentPageFromIyzico(activity, user, request.Count, userIp);

                return paymentPageContent;
            }
        }
    }
}
