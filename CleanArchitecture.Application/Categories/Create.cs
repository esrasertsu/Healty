using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Categories
{
    public class Create
    {
        public class Command : IRequest
        {
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
           // private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context 
               // ,IUserAccessor userAccessor
                )
            {
                _context = context;
             //   _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var category = new Category
                {
                    Name = request.Name
                };

                _context.Categories.Add(category); //addsync is just for special creators

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
