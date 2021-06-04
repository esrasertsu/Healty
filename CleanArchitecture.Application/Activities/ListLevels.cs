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

namespace CleanArchitecture.Application.Activities
{
        public class ListLevels
        {
            public class Query : IRequest<List<LevelDto>> { }

            public class Handler : IRequestHandler<Query, List<LevelDto>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;

                public Handler(DataContext context, IMapper mapper)
                {
                    _context = context;
                    _mapper = mapper;

                }
                public async Task<List<LevelDto>> Handle(Query request, CancellationToken cancellationToken)
                {
                    var levels = await _context.Levels.ToListAsync(cancellationToken);
                    return _mapper.Map<List<Level>, List<LevelDto>>(levels);

                }
            }
        }
    }
