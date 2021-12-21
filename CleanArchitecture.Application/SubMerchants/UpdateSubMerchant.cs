using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
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
    public class UpdateSubMerchant
    {
        public class Command : IRequest<IyziSubMerchantResponse>
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

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ContactName).NotEmpty();
                RuleFor(x => x.ContactSurname).NotEmpty();
                RuleFor(x => x.MerchantType).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.GsmNumber).NotEmpty();
                RuleFor(x => x.Iban).NotEmpty();

            }
        }

        public class Handler : IRequestHandler<Command, IyziSubMerchantResponse>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext context, IMapper mapper, UserManager<AppUser> userManager, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
                _userManager = userManager;
            }
            public async Task<IyziSubMerchantResponse> Handle(Command request, CancellationToken cancellationToken)
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

                var subMerchant = await _context.SubMerchants.FindAsync(new Guid(request.Id));

                if (subMerchant == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                //subMerchant yarat

                subMerchant.MerchantType = (MerchantType)merchantType;
                subMerchant.Address = request.Address;
                subMerchant.LastEditDate = DateTime.Now;
                subMerchant.ContactName = request.ContactName;
                subMerchant.ContactSurname = request.ContactSurname;
                subMerchant.Email = request.Email;
                subMerchant.GsmNumber = request.GsmNumber;
                subMerchant.Iban = request.Iban;
                subMerchant.Name = request.LegalCompanyTitle;

                if (subMerchant.MerchantType == MerchantType.LimitedOrAnonim)
                {
                    if(request.TaxOffice == "" || request.TaxOffice == null || request.LegalCompanyTitle =="" || request.TaxOffice ==""
                        || request.TaxNumber == "" || request.TaxNumber == null)
                        throw new Exception("Problem creating subMerchant -- tax office, tax number and/or legal company title not be null");
                    
                    subMerchant.TaxNumber = request.TaxNumber;
                    subMerchant.TaxOffice = request.TaxOffice;
                    subMerchant.LegalCompanyTitle = request.LegalCompanyTitle;
                }
                else if (subMerchant.MerchantType == MerchantType.Private)
                {
                    if (request.TaxOffice == "" || request.TaxOffice == null || request.LegalCompanyTitle == "" || request.TaxOffice == ""
                        || request.IdentityNumber == "" || request.IdentityNumber == null)
                        throw new Exception("Problem creating subMerchant -- tax office , identity number and/or legal company title not be null");

                    subMerchant.TaxOffice = request.TaxOffice;
                    subMerchant.LegalCompanyTitle = request.LegalCompanyTitle;
                }
                else if (subMerchant.MerchantType == MerchantType.Personal)
                {
                    if (request.IdentityNumber == "" || request.IdentityNumber == null)
                        throw new Exception("Problem creating subMerchant -- TCKN not be null");
                }

                    try
                    {
                        if (request.SubMerchantKey == "" || request.SubMerchantKey == null)
                        {
                            var result = _paymentAccessor.CreateSubMerchantIyzico(subMerchant);
                            if (result.Status)
                            {
                                subMerchant.SubMerchantKey = result.SubMerchantKey;
                                subMerchant.Status = true;
                                subMerchant.ApplicationDate = DateTime.Now;
                                subMerchant.LastEditDate = DateTime.Now;
                                var editedSubMerchant = await _context.SaveChangesAsync() > 0;

                                if (editedSubMerchant)
                                {
                                    user.SubMerchantKey = result.SubMerchantKey;
                                    user.LastProfileUpdatedDate = DateTime.Now;
                                    await _userManager.UpdateAsync(user);

                                    return result;
                                }
                                else
                                {
                                    throw new Exception("Problem editing subMerchant Key on DB");
                                }

                            }
                            else
                            {
                                return result;
                            }
                        }
                        else
                        {
                            var response = _paymentAccessor.UpdateSubMerchantIyzico(subMerchant);
                            if(response.Status)
                            {
                                subMerchant.LastEditDate = DateTime.Now;
                                var editedSubMerchant = await _context.SaveChangesAsync() > 0;

                                if (editedSubMerchant)
                                {
                                    user.LastProfileUpdatedDate = DateTime.Now;
                                    await _userManager.UpdateAsync(user);

                                    return response;
                                }
                                else
                                {
                                    throw new Exception("Problem editing subMerchant Key on DB");
                                }

                        }
                            else
                                return response;
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
