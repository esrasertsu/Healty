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

namespace CleanArchitecture.Application.Admin.Reviews
{
    public class UpdateActReviewStatus
    {
        public class Command : IRequest
        {
            public Guid ReviewId { get; set; }
            public bool Status { get; set; }
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
          

                var review = await _context.ActivityReviews.SingleOrDefaultAsync(x => x.Id == request.ReviewId);

                if (review == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Review = "Not Found" });

                try
                {
                    if (review.Status != request.Status)
                    {
                        review.Status = request.Status;

                        var success = await _context.SaveChangesAsync() > 0;

                        if (success) return Unit.Value;
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
