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
        public class ListAccessibilities
        {
            public class Query : IRequest<List<AccessibilityDto>>{}

            public class Handler : IRequestHandler<Query, List<AccessibilityDto>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;

                public Handler(DataContext context, IMapper mapper)
                {
                    _context = context;
                    _mapper = mapper;
                }

            public async Task<List<AccessibilityDto>> Handle(Query request, CancellationToken cancellationToken)
                {
                    var acc = await _context.Accessibilities.ToListAsync(cancellationToken);
                    return _mapper.Map<List<Accessibility>, List<AccessibilityDto>>(acc);
            }
            }
        }
}
