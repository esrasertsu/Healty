using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Validators;
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
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }
        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists."});

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });

                try
                {
                    var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email,
                        UserName = request.UserName,
                        Role = Role.User
                    };

                    var result = await _userManager.CreateAsync(user, request.Password);

                    if (result.Succeeded)
                    {
                        return new User
                        {
                            DisplayName = user.DisplayName,
                            Token = _jwtGenerator.CreateToken(user),
                            UserName = user.UserName,
                            Role = user.Role.ToString()
                        };
                    }

                }
                catch (Exception)
                {

                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });
                }

                throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

            }
        }
    }
}
