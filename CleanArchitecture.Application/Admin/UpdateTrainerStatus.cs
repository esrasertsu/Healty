using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
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
    public class UpdateTrainerStatus
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
            public string Status { get; set; }
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

                if (user.Role != Role.Admin)
                    throw new RestException(HttpStatusCode.Forbidden, new { user = "Not Authorized" });
             
                var trainer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (trainer == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Trainer = "Not Found" });
                
                Enum.TryParse(typeof(Role), request.Status, out var role);
                if (role == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Role = "Not found" });
                }


                try
                {
                    if (trainer.Role != (Role)role)
                    {
                        trainer.Role = (Role)role;

                        var result = await _userManager.UpdateAsync(trainer);

                        if (result.Succeeded) return Unit.Value;
                        else throw new Exception("Problem saving changes");
                    }
                    else
                        return Unit.Value;
                }
                catch (Exception)
                {

                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}
