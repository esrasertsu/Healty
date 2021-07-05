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

            public Query(int? limit, int? offset, bool isGoing, bool isHost, bool isFollowed,bool isOnline, DateTime? startDate, DateTime? endDate,  List<Guid> categoryIds, List<Guid> subCategoryIds, List<Guid> levelIds ,Guid? cityId)
            {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                IsFollowed = isFollowed;
                IsOnline = isOnline;
                StartDate = startDate ?? DateTime.Now;
                EndDate = endDate;
                CategoryIds = categoryIds;
                SubCategoryIds = subCategoryIds;
                LevelIds = levelIds;
                CityId = cityId;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public bool IsFollowed { get; set; }
            public bool IsOnline { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> LevelIds { get; set; }
            public Guid? CityId { get; set; }


        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
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
            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if(request.EndDate!=null)
                {
                    queryable = queryable.Where(x => x.Date <= request.EndDate);
                }

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
                if (request.IsFollowed)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                    var userFollowings = user.Followings.Where(x => x.Observer.UserName == user.UserName).ToList();

                    var followingTrainers = userFollowings.Select(x => x.Target).ToList();

                    queryable = queryable.Where(x => x.UserActivities.Any(
                        a => a.IsHost && followingTrainers.Contains(a.AppUser)
                    ));
                }

                if (request.CategoryIds != null && request.CategoryIds.Count > 0)
                {
                    // List<Guid> subIds = JsonConvert.DeserializeObject<List<Guid>>(request.SubCategoryIds);

                    queryable = queryable.Where(x => x.Categories.Any(
                        a => request.CategoryIds.Contains(a.CategoryId))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }

                if (request.LevelIds != null && request.LevelIds.Count > 0)
                {
                    // List<Guid> subIds = JsonConvert.DeserializeObject<List<Guid>>(request.SubCategoryIds);

                    queryable = queryable.Where(x => x.Levels.Any(
                        a => request.LevelIds.Contains(a.LevelId))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }

                if (request.SubCategoryIds != null && request.SubCategoryIds.Count > 0)
                {
                    // List<Guid> subIds = JsonConvert.DeserializeObject<List<Guid>>(request.SubCategoryIds);

                    queryable = queryable.Where(x => x.SubCategories.Any(
                        a => request.SubCategoryIds.Contains(a.SubCategoryId))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }

                if (request.CityId != null)
                {
                    queryable = queryable.Where(x => x.City.Id == request.CityId);
                }

                if (request.IsOnline == true)
                {
                    queryable = queryable.Where(x => x.Online == true);
                }


                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();


                var acts = new List<ActivityDto>();
                foreach (var act in activities)
                {
                    acts.Add(await _activityReader.ReadActivity(act.Id));
                }


                return new ActivitiesEnvelope
                {
                    Activities = acts,
                    ActivityCount = queryable.Count()
                };

            }
        }

    }
}
