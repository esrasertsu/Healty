using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class AddReferencePic
    {
        public class Command : IRequest<ReferencePic[]>
        {
            public List<IFormFile> Photos { get; set; }
            public List<string> DeletedPhotos { get; set; }


        }

        public class Handler : IRequestHandler<Command, ReferencePic[]>
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

            public async Task<ReferencePic[]> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (request.Photos != null) //yeni eklenenler
                {
                    foreach (var item in request.Photos)
                    {
                        var photoUploadResults = _photoAccessor.AddReferencePic(item);

                        var image = new ReferencePic
                        {
                            Url = photoUploadResults.Url,
                            Id = photoUploadResults.PublicId
                        };


                        user.ReferencePics.Add(image);
                    }
                }

                if (request.DeletedPhotos != null) //silinenler
                {
                    foreach (var item in request.DeletedPhotos)
                    {
                        var photo = user.ReferencePics.Where(x => x.Id == item).FirstOrDefault();
                        if (photo != null)
                        {
                            var result = _photoAccessor.DeletePhoto(photo.Id);
                            if (result != null)
                                user.ReferencePics.Remove(photo);
                        }
                    }

                }


                var success = await _context.SaveChangesAsync() > 0;

                if (success) return user.ReferencePics.ToArray();

                throw new Exception("Problem saving photos");
            }
        }
    }
}
