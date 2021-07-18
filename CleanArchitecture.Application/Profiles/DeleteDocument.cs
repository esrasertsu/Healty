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

namespace CleanArchitecture.Application.Profiles
{
    public class DeleteDocument
    {
        public class Command : IRequest
        {
            public string Id { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IDocumentAccessor _documentAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IDocumentAccessor documentAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _documentAccessor = documentAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var doc = user.Certificates.FirstOrDefault(x => x.Id == request.Id);

                if (doc == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Doc = "Not found" });


                var result = _documentAccessor.DeleteDocument(doc.Id, doc.ResourceType);

                if (result == null)
                    throw new Exception("Problem deleting document");
                else
                {
                    user.Certificates.Remove(doc);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success)
                        return Unit.Value;
                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}
