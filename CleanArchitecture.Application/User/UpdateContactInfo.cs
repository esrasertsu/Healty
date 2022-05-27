using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Validators;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class UpdateContactInfo
    {
        public class Command : IRequest
        {
            public string PhoneNumber { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Address { get; set; }
            public Guid? CityId { get; set; }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.PhoneNumber).NotEmpty();
                    RuleFor(x => x.Name).NotEmpty();
                    RuleFor(x => x.Surname).NotEmpty();
                }
            }

            public class Handler : IRequestHandler<Command, Unit>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IDocumentAccessor _documentAccessor;
                private readonly UserManager<AppUser> _userManager;
                private readonly IUserCultureInfo _userCultureInfo;

                public Handler(DataContext context, IUserAccessor userAccessor, IDocumentAccessor documentAccessor, 
                    UserManager<AppUser> userManager, IUserCultureInfo userCultureInfo)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                    _documentAccessor = documentAccessor;
                    _userManager = userManager;
                    _userCultureInfo = userCultureInfo;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    var phone = request.PhoneNumber.Trim();
                    if (!phone.StartsWith("+"))
                        phone = "+" + phone;

                    user.Name = request.Name;
                    user.Surname = request.Surname;
                    user.Address = request.Address;
                    user.PhoneNumber =phone;
                    user.LastProfileUpdatedDate =  _userCultureInfo.GetUserLocalTime();

                    if (request.CityId != null && request.CityId != Guid.Empty)
                    {
                        var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == request.CityId);
                        if (city == null)
                            throw new RestException(HttpStatusCode.NotFound, new { City = "NotFound" });
                        else
                        {
                            user.City = city;
                        }
                    }

                    try
                    {
                        var result = await _context.SaveChangesAsync() > 0;
                        if (result)
                            return Unit.Value;
                        throw new Exception("Problem saving changes");


                    }
                    catch (Exception e)
                    {
                        throw new Exception("Problem saving changes", e);
                    }

                }
               
            }
        }
    }
}
