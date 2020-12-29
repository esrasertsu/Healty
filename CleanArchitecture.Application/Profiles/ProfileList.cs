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

namespace CleanArchitecture.Application.Profiles
{
    public class ProfileList
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Role { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var users = await _context.Users.ToListAsync(cancellationToken);

                return _mapper.Map<List<AppUser>, List<Profile>>(users);

            }
        }

    }
}
