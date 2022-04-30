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
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class UpdateAccountInfo
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string PhoneNumber { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Address { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }
            public Guid? CityId { get; set; }

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

            public class Handler : IRequestHandler<Command, Unit>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IDocumentAccessor _documentAccessor;
                private readonly UserManager<AppUser> _userManager;


                public Handler(DataContext context, IUserAccessor userAccessor, IDocumentAccessor documentAccessor, UserManager<AppUser> userManager)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                    _documentAccessor = documentAccessor;
                    _userManager = userManager;

                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    user.DisplayName = request.DisplayName;
                    user.Name = request.Name;
                    user.Surname = request.Surname;
                    user.Address = request.Address;
                    user.UserName = request.UserName ?? user.UserName;
                    user.PhoneNumber = request.PhoneNumber ?? String.Empty;
                    user.Email = request.Email ?? String.Empty;
                    user.LastProfileUpdatedDate = DateTime.Now;

                    if (request.CityId != null && request.CityId != Guid.Empty)
                    {
                        var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == request.CityId);
                        if (city == null)
                            throw new RestException(HttpStatusCode.NotFound, new { City = "NotFound" });
                        else
                        {
                            user.City = city;
                        }
                    }
                   
                    try
                    {
                        var result = await _context.SaveChangesAsync() > 0;
                        if (result)
                        {
                            var changedPass = await ChangePasswordAsync(user, request.Password);
                            if (!changedPass.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem changing user password" });
                            return Unit.Value;

                        }
                        throw new Exception("Problem saving changes");


                    }
                    catch (Exception e)
                    {
                        throw new Exception("Problem saving changes", e);
                    }

                }

                public async Task<IdentityResult> ChangePasswordAsync(AppUser user, string newPassword)
                {
                    string token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    return await _userManager.ResetPasswordAsync(user, token, newPassword);
                }
            }
        }
    }
}
