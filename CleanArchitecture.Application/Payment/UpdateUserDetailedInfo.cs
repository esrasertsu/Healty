﻿using AutoMapper;
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

namespace CleanArchitecture.Application.Payment
{
    public class UpdateUserDetailedInfo
    {

        public class Query : IRequest<bool>
        {
            public string UserId { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string GsmNumber { get; set; }
            //public bool HasSignedIyzicoContract { get; set; }
            public string Address { get; set; }
            public Guid CityId { get; set; }
            public Guid ActivityId { get; set; }
            public int TicketCount { get; set; }
        }

        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor,
                IHttpContextAccessor httpContextAccessor, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
                _userCultureInfo = userCultureInfo;
            }
            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var city = await _context.Cities.FindAsync(request.CityId);

                var success = true;

                if (user.Name != request.Name || user.Surname != request.Surname || user.Address != request.Address || user.PhoneNumber != request.GsmNumber ||
                    user.City.Id != request.CityId)
                {
                    user.Address = request.Address;
                    user.PhoneNumber = request.GsmNumber;
                    //  user.HasSignedIyzicoContract = request.HasSignedIyzicoContract;
                    user.City = city;
                    user.Name = request.Name;
                    user.Surname = request.Surname;
                    user.LastProfileUpdatedDate = _userCultureInfo.GetUserLocalTime();

                    success = await _context.SaveChangesAsync() > 0;

                }

                if (success)
                {
                    return true;
                }
                throw new Exception("Problem saving user data");



            }
        }
    }
}
