using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class AddCoverImage
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }

        }

        public class Handler : IRequestHandler<Command, Photo>
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


            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                var photoUploadResults = _photoAccessor.AddUserCoverPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResults.Url,
                    Id = photoUploadResults.PublicId,
                    IsCoverPic = true
                };

                var exCoverPhoto = user.Photos.Where(x => x.IsCoverPic).FirstOrDefault();

                if (exCoverPhoto != null)
                {
                    _photoAccessor.DeletePhoto(exCoverPhoto.Id);
                    user.Photos.Remove(exCoverPhoto);
                }

                user.Photos.Add(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return photo;

                throw new Exception("Problem saving photo");
            }

          
        }
    }
}
