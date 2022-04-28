using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class AccountSettings
    {
        public class Query : IRequest<AccountDto>
        {

        }
        public class Handler : IRequestHandler<Query, AccountDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;


            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, DataContext context, IMapper mapper)
            {
                _userManager = userManager;
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<AccountDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Sistemde bir kullanıcı bulunamadı." });

                return _mapper.Map<AppUser, AccountDto>(user);
            }
        }
    }
}
