using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    public class SubMerchantDetails
    {

        public class Query : IRequest<SubMerchantDto>
        {
        }

        public class Handler : IRequestHandler<Query, SubMerchantDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _paymentAccessor = paymentAccessor;
                _userManager = userManager;
            }
            public async Task<SubMerchantDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                try
                {
                   
                        if (user.SubMerchantDetails != null)
                        {
                            var IyzicoMerchant = _paymentAccessor.GetSubMerchantFromIyzico(user.SubMerchantDetails.Id.ToString());

                            if (IyzicoMerchant.Status == false || IyzicoMerchant.SubMerchantKey == "" || IyzicoMerchant.SubMerchantKey == null)
                            {
                                user.SubMerchantKey = "";
                                _context.SubMerchants.Remove(user.SubMerchantDetails);
                                await _context.SaveChangesAsync();
                                return null;
                            }
                            else
                            {
                                if (user.SubMerchantKey != IyzicoMerchant.SubMerchantKey)
                                {
                                    user.SubMerchantKey = "";
                                    _context.SubMerchants.Remove(user.SubMerchantDetails);
                                    await _context.SaveChangesAsync();
                                    return null;
                                }
                                else return _mapper.Map<SubMerchant, SubMerchantDto>(user.SubMerchantDetails);
                            }
                        }
                        else
                        {
                            user.SubMerchantKey = "";
                             await _userManager.UpdateAsync(user);
                            return null;
                        }

                   

                }
                catch (Exception e)
                {

                    throw new RestException(HttpStatusCode.BadRequest, new { SubMerchant = e.Message });
                }
                
            }
        }
    }
}
