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

namespace CleanArchitecture.Application.Contracts
{
    public class Details
    {
        public class Query : IRequest<ContractDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, ContractDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ContractDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var cont = await _context.Contracts
                                               .FindAsync(request.Id);

                if (cont == null)
                    throw new RestException(HttpStatusCode.NotFound, new { post = "Not Found" });

                var blogReturn = _mapper.Map<Contract, ContractDto>(cont);

                return blogReturn;

            }
        }
    }
}
