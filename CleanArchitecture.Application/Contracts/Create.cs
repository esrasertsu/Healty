using CleanArchitecture.Application.Interfaces;
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
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context,  IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _userCultureInfo = userCultureInfo;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var contract = new Contract
                {
                    Title = request.Name,
                    Code = request.Code,
                    CreatedDate = _userCultureInfo.GetUserLocalTime(),
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
