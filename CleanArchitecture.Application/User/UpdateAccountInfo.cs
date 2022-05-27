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
    public class UpdateAccountInfo
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.DisplayName).NotEmpty();
                    RuleFor(x => x.UserName).NotEmpty();
                    RuleFor(x => x.Email).NotEmpty().EmailAddress();
                }
            }

            public class Handler : IRequestHandler<Command, Unit>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IDocumentAccessor _documentAccessor;
                private readonly UserManager<AppUser> _userManager;
                private readonly IUserCultureInfo _userCultureInfo;

                public Handler(DataContext context, IUserAccessor userAccessor, IDocumentAccessor documentAccessor,
                    UserManager<AppUser> userManager ,IUserCultureInfo userCultureInfo)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                    _documentAccessor = documentAccessor;
                    _userManager = userManager;
                    _userCultureInfo = userCultureInfo;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    if(user.UserName != request.UserName && await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    {
                       throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });
                    }

                    if (user.Email != request.Email && await _context.Users.AnyAsync(x => x.Email == request.Email))
                    {
                        throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Email already exists." });
                    }

                    user.DisplayName = request.DisplayName;
                    user.UserName = request.UserName;
                    user.Email = request.Email;
                    user.LastProfileUpdatedDate = _userCultureInfo.GetUserLocalTime();

                    try
                    {
                        var result = await _context.SaveChangesAsync() > 0;
                        if (result)
                         return Unit.Value;
                        throw new Exception("Problem saving changes");
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Problem saving changes", e);
                    }

                }
            }
        }
    }
}
