using CleanArchitecture.Application.Errors;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class DeleteCommissionStat
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
                var cat = await _context.CommissionStatuses.FindAsync(request.Id);

                if (cat == null)
                    throw new RestException(HttpStatusCode.NotFound, new { subcategory = "Not Found" });

                _context.CommissionStatuses.Remove(cat);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem deleting post");
            }
        }
    }
}
