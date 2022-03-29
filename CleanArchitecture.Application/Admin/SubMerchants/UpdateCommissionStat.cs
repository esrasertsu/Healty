using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class UpdateCommissionStat
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Rate { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var stat = await _context.CommissionStatuses.SingleOrDefaultAsync(x => x.Id == request.Id);

                if (stat == null)
                    throw new RestException(HttpStatusCode.NotFound, new { stat = "Not Found" });

                try
                {
                    if (stat.Name != request.Name || stat.Rate != Convert.ToDecimal(request.Rate))
                    {
                        stat.Name = request.Name;
                        stat.Rate = Convert.ToDecimal(request.Rate);

                        var result = await _context.SaveChangesAsync() > 0;

                        if (result) return Unit.Value;
                        else throw new Exception("Problem saving changes");
                    }
                    else
                        return Unit.Value;
                }
                catch (Exception)
                {

                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}
