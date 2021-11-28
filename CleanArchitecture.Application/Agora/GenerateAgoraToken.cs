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

namespace CleanArchitecture.Application.Agora
{
    public class GenerateAgoraToken
    {
        public class Query : IRequest<string>
        {
            public string ChannelName { get; set; }
            public Guid ActivityId { get; set; }

        }


        public class Handler : IRequestHandler<Query, string>
        {
            private readonly DataContext _context;
            private readonly IAgoraAccessor _agoraAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IAgoraAccessor agoraAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _agoraAccessor = agoraAccessor;
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
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "User not authorize to join this event" });


                var ts = Convert.ToUInt32(0);
                //Convert.ToUInt32(ToTimestamp(DateTime.UtcNow.ToUniversalTime()) - 30000);
                var uid = Convert.ToUInt32(0);
                var result = "";

                try
                {
                    result = _agoraAccessor.GenerateToken(request.ChannelName, uid, ts);

                }
                catch (Exception ex)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Token = ex.Message });

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