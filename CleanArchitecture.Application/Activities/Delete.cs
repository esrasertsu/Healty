using CleanArchitecture.Application.Errors;
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
                public Handler(DataContext context)
                {
                    _context = context;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.FindAsync(request.Id);

                    if (activity == null)
                        throw new RestException(HttpStatusCode.NotFound, new { activity ="Not Found"});

                ////var comments =  _context.Comments.Where(x => x.ActivityId == activity.Id).ToList();
                //_context.Comments.RemoveRange(comments);

                _context.Remove(activity);
              //  _context.UserActivities.RemoveRange(attendances);
               
                var success = _context.SaveChanges() > 0;

                if (success)
                {
                  //  _context.Activities.Remove(activity);

                  //  var success2 = await _context.SaveChangesAsync() > 0;

                 //   if (success)
                        return Unit.Value;
                 //   throw new Exception("Problem saving changes");
                }
                else
                {
                    throw new Exception("Problem saving changes");
                }
                }
            }
        }
}
