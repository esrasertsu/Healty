using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class ListReferencePics
    {
        public class Query : IRequest<List<ReferencePic>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ReferencePic>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context,IMapper mapper)
            {
                _context = context;
                _mapper = mapper;

            }

            public async Task<List<ReferencePic>> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                return user.ReferencePics.ToList();
            }
        }
    }
}
