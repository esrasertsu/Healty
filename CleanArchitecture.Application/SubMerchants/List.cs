using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Blogs;
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
using Microsoft.AspNetCore.Identity;
using CleanArchitecture.Application.Interfaces;

namespace CleanArchitecture.Application.SubMerchants
{
    public class List
    {
        public class SubMerchantListEnvelope
        {
            public List<SubMerchantDto> SubMerchantList { get; set; }
            public int SubMerchantCount { get; set; }
        }
        public class Query : IRequest<SubMerchantListEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, SubMerchantListEnvelope>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, UserManager<AppUser> userManager,  IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
                _mapper = mapper;

            }

            public async Task<SubMerchantListEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());


                if (user == null || user.Role != Role.Admin)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = _context.SubMerchants
                  .OrderBy(x => x.RegistrationDate)
                  .AsQueryable();

                var subMerchants = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 5).ToListAsync();

                return new SubMerchantListEnvelope
                {
                    SubMerchantList = _mapper.Map<List<SubMerchant>, List<SubMerchantDto>>(subMerchants),
                    SubMerchantCount = queryable.Count()
                };
            }
        }
    }
}
