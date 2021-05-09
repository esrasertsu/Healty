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
            public Query(int? limit, int? offset, string userName, Guid? categoryId, Guid? subCategoryId)
            {
                Limit = limit;
                Offset = offset;
                UserName = userName;
                CategoryId = categoryId;
                SubCategoryId = subCategoryId;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string UserName { get; set; }
            public Guid? CategoryId { get; set; }
            public Guid? SubCategoryId { get; set; }
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
                if (request.SubCategoryId != null)
                {
                    queryablePosts = queryablePosts.Where(x => x.SubCategories.Any(
                        a => a.SubCategoryId == request.SubCategoryId));
                }

                var blogs = await queryablePosts
                   .Skip(request.Offset ?? 0)
                   .Take(request.Limit ?? 3).ToListAsync();

                return new BlogsEnvelope
                {
                    Blogs = _mapper.Map<List<Blog>, List<BlogDto>>(blogs),
                    BlogCount = queryablePosts.Count()
                };

            }
        }
    }
}
