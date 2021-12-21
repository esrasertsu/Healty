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
    public class CreateSubMerchant
    {
        public class Query : IRequest<IyziSubMerchantResponse>
        {
            public string Id { get; set; }
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
            public bool HasSignedContract { get; set; }

        }

        public class CommandValidator : AbstractValidator<Query>
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


        public class Handler : IRequestHandler<Query, IyziSubMerchantResponse>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly UserManager<AppUser> _userManager;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, UserManager<AppUser> userManager, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
                _userManager = userManager;

            }
            public async Task<IyziSubMerchantResponse> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                           x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                Enum.TryParse(typeof(MerchantType), request.MerchantType, out var merchantType);
                if(merchantType==null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { MerchantType = "Not found" });
                }

                if (!string.IsNullOrEmpty(user.SubMerchantKey))
                {
                    _context.SubMerchants.Remove(user.SubMerchantDetails);
                    user.SubMerchantKey = "";
                    await _context.SaveChangesAsync();
                }
                

                //subMerchant yarat
                var subMerchant = new SubMerchant();

                if (request.HasSignedContract)
                    subMerchant.HasSignedContract = request.HasSignedContract;
                else
                    throw new RestException(HttpStatusCode.BadRequest, new { HasSignedContract = "Not signed contract" });

               // subMerchant.Id = new Guid(request.Id);
                subMerchant.User = user;
                subMerchant.UserId = user.Id;
                subMerchant.MerchantType = (MerchantType)merchantType;
                subMerchant.Address = request.Address;
                subMerchant.ContactName = request.ContactName;
                subMerchant.ContactSurname = request.ContactSurname;
                subMerchant.Email = request.Email;
                subMerchant.GsmNumber = request.GsmNumber;
                subMerchant.Iban = request.Iban;
                subMerchant.IdentityNumber = request.IdentityNumber;
                subMerchant.Name = request.LegalCompanyTitle;

                if (subMerchant.MerchantType == MerchantType.LimitedOrAnonim)
                {
                    if (request.TaxOffice == "" || request.TaxOffice == null || request.LegalCompanyTitle == "" || request.TaxOffice == "")
                        throw new Exception("Problem creating subMerchant -- tax office and/or legal company title not be null");

                    subMerchant.TaxOffice = request.TaxOffice;
                    subMerchant.LegalCompanyTitle = request.LegalCompanyTitle;
                }
                else if (subMerchant.MerchantType == MerchantType.Private)
                {
                    if (request.TaxOffice == "" || request.TaxOffice == null || request.LegalCompanyTitle == "" || request.TaxOffice == ""
                        || request.TaxNumber == "" || request.TaxNumber == null)
                        throw new Exception("Problem creating subMerchant -- tax office , tax number and/or legal company title not be null");

                    subMerchant.TaxOffice = request.TaxOffice;
                    subMerchant.TaxNumber = request.TaxNumber;
                    subMerchant.LegalCompanyTitle = request.LegalCompanyTitle;
                }
                else if (subMerchant.MerchantType == MerchantType.Personal)
                {
                    if (request.IdentityNumber == "" || request.IdentityNumber == null)
                        throw new Exception("Problem creating subMerchant -- TCKN not be null");
                }


                user.SubMerchantDetails = subMerchant;

                var createdSubMerchant = await _context.SaveChangesAsync() > 0;

                try
                {
                    if (createdSubMerchant)
                    {
                        IyziSubMerchantResponse result = _paymentAccessor.CreateSubMerchantIyzico(subMerchant);

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
                            _context.SubMerchants.Remove(user.SubMerchantDetails);
                            user.SubMerchantKey = "";
                            user.LastProfileUpdatedDate = DateTime.Now;
                            await _context.SaveChangesAsync();
                            return result;
                        }
                    }
                    else
                    {
                        throw new Exception("Problem creating subMerchant on DB");

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
