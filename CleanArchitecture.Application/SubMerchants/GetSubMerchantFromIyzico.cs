using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.SubMerchants
{
    public class GetSubMerchantFromIyzico
    {
        public class Query : IRequest<SubMerchantDto>
        {
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Query, SubMerchantDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor,IPaymentAccessor paymentAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _paymentAccessor = paymentAccessor;
            }
            public async Task<SubMerchantDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                //if(user.SubMerchantDetails == null || user.SubMerchantKey =="" || user.SubMerchantKey == null)
                //{
                //    throw new RestException(HttpStatusCode.NotFound, new { SubMerchantDetails = "Not found" });

                //}

                var subMerchant = _paymentAccessor.GetSubMerchantFromIyzico(request.Id.ToString());


                return _mapper.Map<SubMerchant, SubMerchantDto>(subMerchant);

            }
        }
    }
}


