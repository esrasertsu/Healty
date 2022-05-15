using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Contracts
{
    public class Create
    {
        public class Command : IRequest
        {
            public string Name { get; set; }
            public string Code { get; set; }

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
                var contract = new Contract
                {
                    Title = request.Name,
                    Code = request.Code,
                    CreatedDate = DateTime.Now,
                    Status = false
                };

                _context.Contracts.Add(contract); //addsync is just for special creators

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
