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

namespace CleanArchitecture.Application.Blogs
{
    public class Details
    {
        public class Query : IRequest<BlogDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, BlogDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<BlogDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var blog = await _context.Blogs
                                               .FindAsync(request.Id);

                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new { post = "Not Found" });

                var blogReturn = _mapper.Map<Blog, BlogDto>(blog);

                return blogReturn;

            }
        }
    }
}
