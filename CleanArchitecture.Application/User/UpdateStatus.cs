using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
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
    public class UpdateStatus
    {
        public class Command : IRequest
        {
            public bool Status { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "Not Found" });

                if (user.IsOnline != request.Status)
                {
                    Thread.Sleep(3000);
                    user.IsOnline = request.Status;                    
                    
                    var result = await _userManager.UpdateAsync(user);

                    if(result.Errors.Any(x => x.Code == "ConcurrencyFailure"))
                        return Unit.Value;
                    if (result.Succeeded) return Unit.Value;
                }
                else
                    return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}

