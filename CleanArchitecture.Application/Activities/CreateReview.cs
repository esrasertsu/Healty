using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class CreateReview
    {
        public class Command : IRequest
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public int StarCount { get; set; }
            public bool AllowDisplayName { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });


                var author = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (author == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });


                var review = new ActivityReview
                {
                    Author = author,
                    Activity = activity,
                    StarCount = request.StarCount,
                    Body = request.Body,
                    CreatedAt = DateTime.Now,
                    AllowDisplayName = request.AllowDisplayName,
                    Status = false
                };

                var existingReview = await _context.ActivityReviews.SingleOrDefaultAsync(x => x.AuthorId == author.Id && x.ActivityId == activity.Id);

                if (existingReview != null)
                {

                    _context.ActivityReviews.Remove(existingReview);
                }


                _context.ActivityReviews.Add(review);
                //                trainer.ReceivedComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
