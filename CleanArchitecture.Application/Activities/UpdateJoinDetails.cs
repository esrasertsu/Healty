using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using System;
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
            public bool Zoom { get; set; }
            public string ActivityUrl { get; set; }
            public string MeetingId { get; set; }
            public string MeetingPsw { get; set; }
        }


        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IActivityReader _activityReader;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _activityReader = activityReader;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                activity.ActivityJoinDetails = new ActivityJoinDetails();
                activity.ActivityJoinDetails.ActivityUrl = request.ActivityUrl ?? activity.ActivityJoinDetails.ActivityUrl;
                activity.ActivityJoinDetails.MeetingId = request.MeetingId ?? activity.ActivityJoinDetails.MeetingId;
                activity.ActivityJoinDetails.MeetingPsw = request.ActivityUrl ?? activity.ActivityJoinDetails.MeetingPsw;
                activity.ActivityJoinDetails.Zoom = request.Zoom;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                   return Unit.Value;
                else throw new RestException(HttpStatusCode.BadRequest, new { activity = "activity's already been updated" });


            }
        }
    }
}
