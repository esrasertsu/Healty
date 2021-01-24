using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Posts
{
    public class Details
    {
        public class Query : IRequest<PostDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, PostDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<PostDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var post = await _context.Posts
                                               .FindAsync(request.Id);

                if (post == null)
                    throw new RestException(HttpStatusCode.NotFound, new { post = "Not Found" });

                var postReturn = _mapper.Map<Post, PostDto>(post);

                return postReturn;

            }
        }
    }
}
