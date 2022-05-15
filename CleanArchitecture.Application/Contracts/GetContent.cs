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
    public class GetContent
    {
        public class Query : IRequest<string>
        {
            public string Code { get; set; }
        }
        public class Handler : IRequestHandler<Query, string>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var cont = await _context.Contracts.SingleOrDefaultAsync(x => x.Code == request.Code);

                if (cont == null)
                    throw new RestException(HttpStatusCode.NotFound, new { post = "Not Found" });

                return cont.Content;



            }
        }
    }
}
