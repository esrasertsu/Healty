using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class AddVideoUrl
    {
        public class Command : IRequest
        {
            public string VideoUrl { get; set; }
            public string TrainerUserName { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                if (user.Role == Role.Admin)
                {
                    user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.TrainerUserName);
                }

                user.VideoUrl = request.VideoUrl;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
