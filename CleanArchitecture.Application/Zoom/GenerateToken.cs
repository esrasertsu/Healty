using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Zoom
{
    public class GenerateToken
    {
        public class Query : IRequest<string>
        {
            public Guid ActivityId { get; set; }
            public string MeetingId { get; set; }
            public string Role { get; set; }

        }
        public class Handler : IRequestHandler<Query, string>
        {
            private readonly DataContext _context;
            private readonly IZoomAccessor _zoomAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IZoomAccessor zoomAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _zoomAccessor = zoomAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x =>
                            x.ActivityId == activity.Id && x.AppUserId == user.Id);

                if (attendance == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "User not authorize to join this meeting" });


                string ts = (ToTimestamp(DateTime.UtcNow.ToUniversalTime()) - 30000).ToString();

                var result = "";

                try
                {
                     result = _zoomAccessor.GenerateToken(request.MeetingId, ts, request.Role);

                }
                catch (Exception)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Token = "NotFound" });

                }
                return result;

            }

            public static long ToTimestamp(DateTime value)
            {
                long epoch = (value.Ticks - 621355968000000000) / 10000;
                return epoch;
            }
        }
    }
}
