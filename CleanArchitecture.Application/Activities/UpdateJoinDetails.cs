using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class UpdateJoinDetails
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string ChannelName { get; set; }
            public string ViewUrl { get; set; }
            public string HostUrl { get; set; }
        }


        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IActivityReader _activityReader;
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IActivityReader activityReader,
                IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _activityReader = activityReader;
                _userCultureInfo = userCultureInfo;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                var host =  activity.UserActivities.FirstOrDefault(a => a.AppUser.UserName == user.UserName && a.IsHost);
                
                if (host == null)
                    throw new RestException(HttpStatusCode.Forbidden, new { host = "Not Found" });

                activity.ActivityJoinDetails = new ActivityJoinDetails()
                {
                    ChannelName = request.ChannelName,
                    HostUrl = request.HostUrl,
                    ViewUrl = request.ViewUrl,
                    ActivityId = activity.Id,
                    LastUpdateDate =_userCultureInfo.GetUserLocalTime()
                };

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                   return Unit.Value;
                else throw new RestException(HttpStatusCode.BadRequest, new { activity = "activity's already been updated" });


            }
        }
    }
}
