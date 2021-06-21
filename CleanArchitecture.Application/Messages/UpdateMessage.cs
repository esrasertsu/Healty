using CleanArchitecture.Application.Errors;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Messages
{
    public class UpdateMessage
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public bool Seen { get; set; }
            public Guid ChatRoomId { get; set; }

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
                var message = await _context.Messages.FindAsync(request.Id);

                if (message == null)
                    throw new RestException(HttpStatusCode.NotFound, new { message = "Not Found" });

                message.Seen = request.Seen;
                
                // _context.Activities.Update(activity);
                var success = await _context.SaveChangesAsync() > 0;

                return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
