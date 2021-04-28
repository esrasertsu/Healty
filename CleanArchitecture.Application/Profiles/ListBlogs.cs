using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Blogs;
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

namespace CleanArchitecture.Application.Profiles
{
    public class ListBlogs
    {
        public class UserProfileBlogsEnvelope
        {
            public List<BlogDto> ProfileBlogs { get; set; }
            public int ProfileBlogsCount { get; set; }
        }
        public class Query : IRequest<UserProfileBlogsEnvelope>
        {
            public string Username { get; set; }
            //   public string Predicate { get; set; }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserProfileBlogsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<UserProfileBlogsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = _context.Blogs
                  .Where(x => x.Author == user)
                  .OrderBy(x => x.Date)
                  .AsQueryable();

                var userPosts = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 5).ToListAsync();

                return new UserProfileBlogsEnvelope
                {
                    ProfileBlogs = _mapper.Map<List<Blog>, List<BlogDto>>(userPosts),
                    ProfileBlogsCount = queryable.Count()
                };
            }
        }
    }
}
