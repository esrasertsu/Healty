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
    public class PopularProfilesList
    {
        
        public class Query : IRequest<List<Profile>>
        {
            public Query(int? limit, int? offset, Guid? categoryId, List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId, string sort)
            {
                Limit = limit;
                Offset = offset;
                AccessibilityId = accessibilityId;
                CategoryId = categoryId;
                SubCategoryIds = subCategoryIds;
                CityId = cityId;
                Sort = sort;

            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public Guid? CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public Guid? AccessibilityId { get; set; }
            public Guid? CityId { get; set; }
            public string Sort { get; set; }
        }


        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IProfileReader _profileReader;
            public Handler(DataContext context, IMapper mapper, IProfileReader profileReader)
            {
                _context = context;
                _mapper = mapper;
                _profileReader = profileReader;
            }
            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryableUsers = _context.Users
                    .AsQueryable();

                queryableUsers = queryableUsers.Where(x => x.Role == Role.Trainer);

                #region Filters
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

                #region 10 popular profile
                /*<---  popüler profile ----->*/
                var queryableUsersCopy = await queryableUsers.ToListAsync();
                var popularUsers = queryableUsersCopy.OrderByDescending(x => x.ReceivedComments.Count).ToList();
                var popularProfiles = new List<Profile>();
                foreach (var user in popularUsers)
                {
                    popularProfiles.Add(await _profileReader.ReadProfileCard(user.UserName));
                }
                var orderedpopularProfiles = popularProfiles.OrderByDescending(x => x.Star).Take(10).ToList();
                /*<--- end of popüler profile ----->*/
                #endregion


                return orderedpopularProfiles;
            }
        }
    }
}
