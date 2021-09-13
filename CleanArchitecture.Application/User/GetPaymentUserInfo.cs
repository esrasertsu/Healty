using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Location;
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

namespace CleanArchitecture.Application.User
{
    public class GetPaymentUserInfo
    {

        public class Query : IRequest<PaymentUserInfoDto>
        {
            public Guid ActivityId { get; set; }
            public int Count { get; set; }
        }

        public class Handler : IRequestHandler<Query, PaymentUserInfoDto>
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
            public async Task<PaymentUserInfoDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                PaymentUserInfoDto paymentUserInfo = new PaymentUserInfoDto()
                {
                    ActivityId = activity.Id,
                    UserId = user.Id,
                    Address = user.Address,
                    Name = user.Name,
                    Surname = user.Surname,
                    GsmNumber = user.PhoneNumber,
                    City = new CityDto() { Key = user.City.Id.ToString(), Text = user.City.Name, Value = user.City.Id.ToString() },
                    HasSignedIyzicoContract = user.HasSignedIyzicoContract,
                    TicketCount = request.Count
                };


                return paymentUserInfo;
            }
        }
    }
}
