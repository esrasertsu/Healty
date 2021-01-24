using AutoMapper;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Posts
{
    public class List
    {
        public class Query : IRequest<List<PostDto>> { }

        public class Handler : IRequestHandler<Query, List<PostDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                 _mapper = mapper;

            }
            public async Task<List<PostDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var posts = await _context.Posts.ToListAsync(cancellationToken);

                return _mapper.Map<List<Post>, List<PostDto>>(posts);

            }
        }
    }
}
