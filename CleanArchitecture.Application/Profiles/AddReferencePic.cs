using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class AddReferencePic
    {
        public class Command : IRequest<ReferencePic>
        {
            public IFormFile Original { get; set; }
            public IFormFile Thumbnail { get; set; }
            public string Title { get; set; }


        }

        public class Handler : IRequestHandler<Command, ReferencePic>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<ReferencePic> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                bool isFirstpic = false;

                if(user.ReferencePics.Count == 0) isFirstpic = true;

                var photoUploadResult = _photoAccessor.AddReferencePic(request.Original, request.Thumbnail, isFirstpic);


                var pic = new ReferencePic
                {
                    OriginalUrl = photoUploadResult.OriginalUrl,
                    ThumbnailUrl = photoUploadResult.ThumbnailUrl,
                    OriginalPublicId = photoUploadResult.OriginalPublicId,
                    ThumbnailPublicId = photoUploadResult.ThumbnailPublicId,
                    Width = photoUploadResult.Width,
                    Height= photoUploadResult.Height,
                    Title = request.Title
                };

                user.ReferencePics.Add(pic);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return pic;

                throw new Exception("Problem saving photo");
            }
        }
    }
}
