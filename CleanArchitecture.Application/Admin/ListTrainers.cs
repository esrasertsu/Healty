using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
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

namespace CleanArchitecture.Application.Admin
{
    public class ListTrainers
    {
        public class TrainersEnvelope
        {
            public List<Trainer> TrainerList { get; set; }
            public int TrainerCount { get; set; }

        }

        public class Query : IRequest<TrainersEnvelope>
        {
            public Query(int? limit, int? offset, Guid? categoryId, List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId, string role, string sort)
            {
                Limit = limit;
                Offset = offset;
                AccessibilityId = accessibilityId;
                CategoryId = categoryId;
                SubCategoryIds = subCategoryIds;
                CityId = cityId;
                Sort = sort;
                Role = role;

            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public Guid? CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public Guid? AccessibilityId { get; set; }
            public Guid? CityId { get; set; }
            public string Role { get; set; }
            public string Sort { get; set; }
        }


        public class Handler : IRequestHandler<Query, TrainersEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IProfileReader _profileReader;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IProfileReader profileReader, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _profileReader = profileReader;
                _userAccessor = userAccessor;
            }
            public async Task<TrainersEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                          x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryableUsers = _context.Users
                    .AsQueryable();

                queryableUsers = queryableUsers.Where(x => x.Role == Role.Trainer || x.Role == Role.Suspend || x.Role == Role.UnderConsiTrainer || 
                x.Role == Role.Freeze || x.Role == Role.WaitingTrainer);

                #region Filters
                if (!string.IsNullOrEmpty(request.Role))
                {
                    Enum.TryParse(typeof(Role), request.Role, out var roleType);                    
                        queryableUsers = queryableUsers.Where(x => x.Role == (Role)roleType);
                }
                if (request.CategoryId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.UserCategories.Any(x => x.CategoryId == request.CategoryId));
                }
                if (request.CityId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.City.Id == request.CityId);
                }
                if (request.AccessibilityId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.UserAccessibilities.Any(x => x.AccessibilityId == request.AccessibilityId));
                }

                if (request.SubCategoryIds != null && request.SubCategoryIds.Count > 0)
                {
                    queryableUsers = queryableUsers.Where(x => x.UserSubCategories.Any(
                        a => request.SubCategoryIds.Contains(a.SubCategoryId))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }
                #endregion

                var queryableUsersCopy = await queryableUsers.ToListAsync();

                if (queryableUsers.ToList().Count < request.Limit)
                    request.Limit = queryableUsers.ToList().Count;

                //var users = await queryableUsers
                //   //filtrelenmiş user datası
                //   .Skip(request.Offset ?? 0)
                //   .Take(request.Limit ?? 6).ToListAsync();

                var trainers = new List<Trainer>();

                if (request.Sort == "popular")
                {
                    var popularUsers = queryableUsersCopy.OrderByDescending(x => x.StarCount).ThenByDescending(x => x.Star).Skip(request.Offset ?? 0).Take(request.Limit ?? 6).ToList();
                    //   var popularProfiles = new List<Profile>();
                    foreach (var popuser in popularUsers)
                    {
                        trainers.Add(await _profileReader.ReadTrainerInfo(popuser.UserName));
                    }
                    //   profiles = popularProfiles.OrderByDescending(x => x.Star).Skip(request.Offset ?? 0).Take(request.Limit ?? 6).ToList();

                }
                else
                {
                    var recentUsers = queryableUsersCopy.OrderByDescending(x => x.RegistrationDate).Skip(request.Offset ?? 0).Take(request.Limit ?? 6).ToList();

                    foreach (var u in recentUsers)
                    {
                        trainers.Add(await _profileReader.ReadTrainerInfo(u.UserName));
                    }
                }

                return new TrainersEnvelope
                {
                    TrainerList = trainers,
                    TrainerCount = queryableUsers.Count()
                };
            }
        }

    }
}
