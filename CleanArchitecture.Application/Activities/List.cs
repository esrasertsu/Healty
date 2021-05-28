using AutoMapper;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


//What we want to do with mediatR is a query and a handler for this particular query...
namespace CleanArchitecture.Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }

        }
        public class Query : IRequest<ActivitiesEnvelope> {

            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if(request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(
                        a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()
                    ));
                }
                if(!request.IsGoing && request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(
                        a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost
                    ));
                }


                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };

            }
        }

    }
}
