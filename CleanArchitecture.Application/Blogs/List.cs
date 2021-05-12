using AutoMapper;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Blogs
{
    public class List
    {
        public class BlogsEnvelope
        {
            public List<BlogDto> Blogs { get; set; }
            public int BlogCount { get; set; }

        }

        public class Query : IRequest<BlogsEnvelope> {
            public Query(int? limit, int? offset, string userName, Guid? categoryId, List<Guid> subCategoryIds)
            {
                Limit = limit;
                Offset = offset;
                UserName = userName;
                CategoryId = categoryId;
                SubCategoryIds = subCategoryIds;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string UserName { get; set; }
            public Guid? CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
        }

        public class Handler : IRequestHandler<Query, BlogsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                 _mapper = mapper;

            }
            public async Task<BlogsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryablePosts = _context.Blogs
                   .OrderByDescending(x => x.Date)
                   .AsQueryable();

                if (!string.IsNullOrEmpty(request.UserName))
                {
                    queryablePosts = queryablePosts.Where(x => x.Author.UserName == request.UserName);
                }
                if (request.CategoryId != null)
                {
                    queryablePosts = queryablePosts.Where(x => x.Category.Id == request.CategoryId);
                }
                if (request.SubCategoryIds != null && request.SubCategoryIds.Count>0)
                {
                   // List<Guid> subIds = JsonConvert.DeserializeObject<List<Guid>>(request.SubCategoryIds);

                    queryablePosts = queryablePosts.Where(x => x.SubCategories.Any(
                        a => request.SubCategoryIds.Contains(a.SubCategoryId))); //tostring çevirisi sakın qureylerde yapma client side olarak algılıyor
                }

                var blogs = await queryablePosts
                   .Skip(request.Offset ?? 0)
                   .Take(request.Limit ?? 6).ToListAsync();

                return new BlogsEnvelope
                {
                    Blogs = _mapper.Map<List<Blog>, List<BlogDto>>(blogs),
                    BlogCount = queryablePosts.Count()
                };

            }
        }
    }
}
