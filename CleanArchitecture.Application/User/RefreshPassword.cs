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
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class RefreshPassword
    {
        public class Command : IRequest
        {
            public string Password { get; set; }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
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

                    try
                    {
                        
                        var changedPass = await ChangePasswordAsync(user, request.Password);
                        if (!changedPass.Succeeded)
                            throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem changing user password" });
                        else
                        {
                            user.LastProfileUpdatedDate = DateTime.Now;
                            var result = await _context.SaveChangesAsync() > 0;
                            if (result)
                                return Unit.Value;
                            throw new Exception("Problem saving changes");
                        }
                       

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
