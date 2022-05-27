using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin
{
    public class CreateAdmin
    {
        public class Command : IRequest<Admin>
        {
            public string UserName { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string DisplayName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string PhoneNumber { get; set; }

        }
        public class Handler : IRequestHandler<Command, Admin>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;
            private readonly IProfileReader _profileReader;
            private readonly IUserCultureInfo _userCultureInfo;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, UserManager<AppUser> userManager, IUserCultureInfo userCultureInfo, IProfileReader profileReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _userManager = userManager;
               _profileReader = profileReader;
                _userCultureInfo = userCultureInfo;
            }

        public async Task<Admin> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });


                var admin = new AppUser
                {
                    Name = request.Name,
                    Surname= request.Surname,
                    DisplayName = request.Name + " " + request.Surname,
                    Email = request.Email,
                    EmailConfirmed= true,
                    PhoneNumber= request.PhoneNumber,
                    PhoneNumberConfirmed= true,
                    UserName = request.UserName,
                    Role = Role.Admin,
                    RegistrationDate = _userCultureInfo.GetUserLocalTime(),
                    LastLoginDate =_userCultureInfo.GetUserLocalTime(),
                    Title= "Kurucu Ortak"
                };

                var result = await _userManager.CreateAsync(admin, request.Password);

                if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });
              
                return await _profileReader.ReadAdminInfo(admin.UserName);


            }
        }
    }
}
