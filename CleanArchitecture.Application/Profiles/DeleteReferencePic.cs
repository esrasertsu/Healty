using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
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

namespace CleanArchitecture.Application.Profiles
{
    public class DeleteReferencePic
    {
        public class Command : IRequest
        {
            public string OriginalId { get; set; }
            public string TrainerUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command>
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user.Role == Role.Admin)
                {
                    user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.TrainerUserName);
                }

                var photo = user.ReferencePics.FirstOrDefault(x => x.Id == request.OriginalId);

                if (photo == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not found" });

              
                var result = _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                    throw new Exception("Problem deleting photo");

                user.ReferencePics.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
