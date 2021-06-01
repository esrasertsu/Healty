using AutoMapper;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class ProfileList
    {
        public class ProfilesEnvelope
        {
            public List<Profile> ProfileList { get; set; }
            public List<Profile> PopularProfiles { get; set; }
            public int ProfileCount { get; set; }

        }

        public class Query : IRequest<ProfilesEnvelope>
        {
            public Query(int? limit, int? offset, Guid? categoryId, List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId)
            {
                Limit = limit;
                Offset = offset;
                AccessibilityId = accessibilityId;
                CategoryId = categoryId;
                SubCategoryIds = subCategoryIds;
                CityId = cityId;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public Guid? CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public Guid? AccessibilityId { get; set; }
            public Guid? CityId { get; set; }

        }


        public class Handler : IRequestHandler<Query, ProfilesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<ProfilesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryableUsers = _context.Users
                    .AsQueryable();


                queryableUsers = queryableUsers.Where(x => x.Role == Role.Trainer);


                if (request.CategoryId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.Categories.Any(x => x.Id == request.CategoryId));
                }
                if (request.CityId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.City.Id== request.CityId);
                }
                if (request.AccessibilityId != null)
                {
                    queryableUsers = queryableUsers.Where(x => x.Accessibilities.Any(x => x.Id == request.AccessibilityId));
                }
            
                if (request.SubCategoryIds != null && request.SubCategoryIds.Count > 0)
                {
                    queryableUsers = queryableUsers.Where(x => x.SubCategories.Any(
                        a => request.SubCategoryIds.Contains(a.Id))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }


                var popularUsers = await queryableUsers.OrderByDescending(x => x.ReceivedComments.Count).ToListAsync();
                var popularProfiles = _mapper.Map<List<AppUser>, List<Profile>>(popularUsers.ToList());

                var lpopularProfiles = popularProfiles.OrderByDescending(x => x.Star).Take(10).ToList();

                if (queryableUsers.ToList().Count < request.Limit)
                    request.Limit = queryableUsers.ToList().Count;

                var users = await queryableUsers
                   .Skip(request.Offset ?? 0)
                   .Take(request.Limit ?? 6).ToListAsync();

                return new ProfilesEnvelope
                {
                    ProfileList = _mapper.Map<List<AppUser>, List<Profile>>(users),
                    ProfileCount = queryableUsers.Count(),
                    PopularProfiles = lpopularProfiles
                };
            }
        }

    }
}
