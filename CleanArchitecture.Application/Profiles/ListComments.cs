using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.UserProfileComments;
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
    public class ListComments
    {
        public class UserProfileCommentsEnvelope
        {
            public List<UserProfileCommentDto> ProfileComments { get; set; }
            public int ProfileCommentCount { get; set; }
        }
        public class Query : IRequest<UserProfileCommentsEnvelope>
        {
            public string Username { get; set; }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserProfileCommentsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<UserProfileCommentsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = _context.UserProfileComments
                   .Where(x => x.Target == user) //approved eklenecek
                   .OrderBy(x => x.CreatedAt)
                   .AsQueryable();

                var userComments = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 5).ToListAsync();

                return new UserProfileCommentsEnvelope
                {
                    ProfileComments = _mapper.Map<List<UserProfileComment>, List<UserProfileCommentDto>>(userComments),
                    ProfileCommentCount = queryable.Count()
                };
            }
        }
    }
}
