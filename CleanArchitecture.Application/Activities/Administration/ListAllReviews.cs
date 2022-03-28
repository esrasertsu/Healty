using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
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

namespace CleanArchitecture.Application.Activities.Administration
{
    public class ListAllReviews
    {
        public class AllReviewsEnvelope
        {
            public List<ActivityReviewDto> Reviews { get; set; }
            public int ReviewCount { get; set; }

        }
        public class Query : IRequest<AllReviewsEnvelope>
        {

            public Query(int? limit, int? offset, string userName, Guid activityId, bool status)
            {
                Limit = limit;
                Offset = offset;
                UserName = userName;
                Status = status;
                ActivityId = activityId;


            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string UserName { get; set; }
            public Guid ActivityId { get; set; }
            public bool Status { get; set; }



        }

        public class Handler : IRequestHandler<Query, AllReviewsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IActivityReader _activityReader;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _activityReader = activityReader;
            }
            public async Task<AllReviewsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {

                var queryable = _context.ActivityReviews.OrderByDescending(x => x.CreatedAt).AsQueryable();

                if (!string.IsNullOrEmpty(request.UserName))
                {
                    queryable = queryable.Where(x => x.Author.UserName == request.UserName);
                }
                if (request.Status)
                {
                    queryable = queryable.Where(x => x.Status == true);
                }
                else if (request.ActivityId != Guid.Empty)
                {
                    queryable = queryable.Where(x => x.ActivityId == request.ActivityId); 
                }
               
                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();


                return new AllReviewsEnvelope
                {
                    Reviews = _mapper.Map<List<ActivityReview>, List<ActivityReviewDto>>(activities),
                    ReviewCount = queryable.Count()
                };

            }
        }
    }
}
