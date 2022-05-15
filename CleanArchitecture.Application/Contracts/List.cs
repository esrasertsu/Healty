using AutoMapper;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Contracts
{
    public class List
    {
        public class ContractsEnvelope
        {
            public List<ContractDto> Contracts { get; set; }
            public int ContractCount { get; set; }

        }

        public class Query : IRequest<ContractsEnvelope>
        {
            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, ContractsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;

            }
            public async Task<ContractsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryablePosts = _context.Contracts
                   .OrderByDescending(x => x.CreatedDate)
                   .AsQueryable();

              
                var blogs = await queryablePosts
                   .Skip(request.Offset ?? 0)
                   .Take(request.Limit ?? 6).ToListAsync();

                return new ContractsEnvelope
                {
                    Contracts = _mapper.Map<List<Contract>, List<ContractDto>>(blogs),
                    ContractCount = queryablePosts.Count()
                };

            }
        }
    }
}
