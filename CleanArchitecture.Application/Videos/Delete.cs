using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Videos
{
        public class Delete
        {
            public class Command : IRequest
            {
                public string Id { get; set; }
                public Guid ActivityId { get; set; }

        }

        public class Handler : IRequestHandler<Command>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IVideoAccessor _videoAccessor;

                public Handler(DataContext context, IUserAccessor userAccessor, IVideoAccessor videoAccessor)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                _videoAccessor = videoAccessor;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.ActivityId);

                    var video = activity.Videos.FirstOrDefault(x => x.Id == request.Id);

                    if (video == null)
                        throw new RestException(HttpStatusCode.NotFound, new { Video = "Not found" });

                    var result = _videoAccessor.DeleteVideo(video.Id);

                    if (result == null)
                        throw new Exception("Problem deleting video");

                    activity.Videos.Remove(video);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success)
                        return Unit.Value;

                    throw new Exception("Problem saving changes");
                }
            }
        }
    
}
