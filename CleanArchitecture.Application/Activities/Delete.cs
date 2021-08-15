using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class Delete
    {
            public class Command : IRequest
            {
                public Guid Id { get; set; }
               
            }

            public class Handler : IRequestHandler<Command>
            {
                private readonly DataContext _context;
               private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor)
                {
                    _context = context;
                    _photoAccessor = photoAccessor;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.FindAsync(request.Id);

                    if (activity == null)
                        throw new RestException(HttpStatusCode.NotFound, new { activity ="Not Found"});

                var photo = activity.Photos.SingleOrDefault(x => x.IsMain == true);
                if(photo!=null)
                {
                    var result = _photoAccessor.DeletePhoto(photo.Id);

                    if (result == null)
                        throw new Exception("Problem deleting photo");

                    activity.Photos.Remove(activity.Photos.SingleOrDefault(x => x.IsMain == true));


                }

                _context.Remove(activity);
               
                var success = _context.SaveChanges() > 0;

                if (success)
                {
                        return Unit.Value;
                }
                else
                {
                    throw new Exception("Problem saving changes");
                }
                }
            }
        }
}
