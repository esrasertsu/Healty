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
    public class UpdateSubMerchant
    {
        public class Command : IRequest<string>
        {
            public string Id { get; set; }
            public string SubMerchantKey { get; set; }
            public string MerchantType { get; set; }
            public string Address { get; set; }
            public string TaxOffice { get; set; } //private,ltd
            public string TaxNumber { get; set; } //ltd
            public string ContactName { get; set; }
            public string ContactSurname { get; set; }
            public string LegalCompanyTitle { get; set; } //private,,ltd
            public string Email { get; set; }
            public string GsmNumber { get; set; }
            public string Name { get; set; }
            public string Iban { get; set; }
            public string IdentityNumber { get; set; }

        }

        public class Handler : IRequestHandler<Command, string>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                           x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                Enum.TryParse(typeof(MerchantType), request.MerchantType, out var merchantType);
                if (merchantType == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { MerchantType = "Not found" });
                }

                var subMerchant = await _context.SubMerchants.FindAsync(request.Id);

                if (subMerchant == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                //subMerchant yarat

                subMerchant.MerchantType = (MerchantType)merchantType;
                subMerchant.Address = request.Address;
                subMerchant.TaxOffice = request.TaxOffice;
                subMerchant.TaxNumber = request.TaxNumber;
                subMerchant.LastEditDate = DateTime.Now;
                subMerchant.ContactName = request.ContactName;
                subMerchant.ContactSurname = request.ContactSurname;
                subMerchant.Email = request.Email;
                subMerchant.GsmNumber = request.GsmNumber;
                subMerchant.Iban = request.Iban;
                subMerchant.IdentityNumber = request.IdentityNumber;
                subMerchant.LegalCompanyTitle = request.LegalCompanyTitle;
                subMerchant.Name = request.Name;


                try
                {
                    var subMerchantKey = _paymentAccessor.UpdateSubMerchantIyzico(subMerchant);

                    if (subMerchantKey != "false")
                    {
                        var updatedSubMerchant = await _context.SaveChangesAsync() > 0;
                        if (updatedSubMerchant)
                            return subMerchantKey;
                        else
                        {
                            throw new Exception("Problem creating subMerchant on DB");
                        }
                    }

                  
                }
                catch (Exception ex)
                {

                    throw new Exception(ex.Message);
                }

                throw new Exception("Problem creating subMerchant");

            }
        }
    }
}
