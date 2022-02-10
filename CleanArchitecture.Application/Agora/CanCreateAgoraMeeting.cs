using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Agora
{
    public class CanCreateAgoraMeeting
    {
        public class Query : IRequest<bool>
        {
            public Guid ActivityId { get; set; }
            public string UserName { get; set; }
            public string Token { get; set; }

        }

        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.ActivityId).NotEmpty();
                RuleFor(x => x.Token).NotEmpty();

            }
        }



        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context, IUserAccessor userAccessor, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userAccessor = userAccessor;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var tokenUser = _jwtGenerator.ReadToken(request.Token);

                if (tokenUser != request.UserName)
                    return false;

               var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x =>
                            x.ActivityId == activity.Id && x.AppUser.UserName == request.UserName);

                if (attendance == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "User not authorize to join this event" });

                return true;

            }
        }
    }
}
