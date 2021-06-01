using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Videos
{
    public class AddActivityVideo
    {
        public class Command : IRequest<Video>
        {
            public Guid Id { get; set; }
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Video>
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

            public async Task<Video> Handle(Command request, CancellationToken cancellationToken)
            {

                var uploadResult = _videoAccessor.AddVideo(request.File);

                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.Id);

                var video = new Video
                {
                    Url = uploadResult.Url,
                    Id = uploadResult.PublicId
                };

                activity.Videos.Add(video);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return video;

                throw new Exception("Problem saving video");
            }
        }
    }
}
