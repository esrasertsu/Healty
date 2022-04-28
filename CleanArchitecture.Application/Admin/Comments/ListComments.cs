using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
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

namespace CleanArchitecture.Application.Admin.Comments
{
    public class ListComments
    {
        public class UserProfileCommentsEnvelope
        {
            public List<AdminProfileCommentsDto> ProfileComments { get; set; }
            public int ProfileCommentCount { get; set; }
        }
        public class Query : IRequest<UserProfileCommentsEnvelope>
        {
            public string Username { get; set; }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool Status { get; set; }

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
                var queryable = _context.UserProfileComments.OrderByDescending(x => x.CreatedAt).AsQueryable();

                if (!string.IsNullOrEmpty(request.Username))
                {
                    queryable = queryable.Where(x => x.Author.UserName == request.Username);
                }
                if (request.Status)
                {
                    queryable = queryable.Where(x => x.Status == true);
                }
               
                var comments = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();


                return new UserProfileCommentsEnvelope
                {
                    ProfileComments = _mapper.Map<List<UserProfileComment>, List<AdminProfileCommentsDto>>(comments),
                    ProfileCommentCount = queryable.Count()
                };

            }
        }
    }
}
