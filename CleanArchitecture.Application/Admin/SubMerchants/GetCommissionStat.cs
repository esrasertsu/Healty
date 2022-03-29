using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class GetCommissionStat
    {

        public class Query : IRequest<CommissionStatusDto>
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Query, CommissionStatusDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IProfileReader _profileReader;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IProfileReader profileReader, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _profileReader = profileReader;
                _userAccessor = userAccessor;
            }
            public async Task<CommissionStatusDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var status = await _context.CommissionStatuses.SingleOrDefaultAsync(x => x.Id == request.Id);

                if (status == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Status = "Not Found" });

                return _mapper.Map<CommissionStatus, CommissionStatusDto>(status);
            }
        }
    }
}
