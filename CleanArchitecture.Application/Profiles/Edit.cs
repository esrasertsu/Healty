using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Profile>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
            public string Experience { get; set; }
            public string ExperienceYear { get; set; }
            public string Certificates { get; set; }
            public string Dependency { get; set; }
            public Guid CityId { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> Accessibilities { get; set; }

            //public class CommandValidator : AbstractValidator<Command>
            //{
            //    public CommandValidator()
            //    {
            //        RuleFor(x => x.DisplayName).NotEmpty();
            //        RuleFor(x => x.CategoryIds).NotEmpty();
            //        RuleFor(x => x.Accessibilities).NotEmpty();
            //        RuleFor(x => x.SubCategoryIds).NotEmpty();
            //    }
            //}

            public class Handler : IRequestHandler<Command, Profile>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IProfileReader _profileReader;


                public Handler(DataContext context, IUserAccessor userAccessor, IProfileReader profileReader)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                    _profileReader = profileReader;
            }

            public async Task<Profile> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    user.DisplayName = request.DisplayName ?? user.DisplayName;
                    user.Dependency = request.Dependency ?? String.Empty;
                    user.Certificates = request.Certificates ?? String.Empty;
                    user.Bio = request.Bio ?? String.Empty;
                    user.Experience = request.Experience ?? String.Empty;
                    user.ExperienceYear = Convert.ToDecimal(request.ExperienceYear) > 0 ? Convert.ToDecimal(request.ExperienceYear) : user.ExperienceYear;
                    
                    if(request.CityId != null && request.CityId != Guid.Empty)
                    {
                        var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == request.CityId);
                        if (city == null)
                            throw new RestException(HttpStatusCode.NotFound, new { City = "NotFound" });
                        else
                        {
                            user.City = user.City == null ? new City
                            {
                                Id = city.Id,
                                Name = city.Name
                            } : city;
                        }
                    }

                    if (request.CategoryIds != null)
                    {
                        user.Categories.Clear();
                        foreach (var catId in request.CategoryIds)
                        {
                            var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                            if (cat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                            else
                            {
                                user.Categories.Add(cat);
                            }
                        }
                    }//komple boş olamaz


                    if (request.SubCategoryIds != null)
                    {
                        user.SubCategories.Clear();
                        foreach (var subCatId in request.SubCategoryIds)
                        {
                            var subCat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == subCatId);

                            if (subCat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                            else
                            {
                                user.SubCategories.Add(subCat);
                            }
                        }
                    }
                   

                    if (request.Accessibilities != null)
                    {
                        user.Accessibilities.Clear();
                        foreach (var accId in request.Accessibilities)
                        {
                            var acc = await _context.Accessibilities.SingleOrDefaultAsync(x => x.Id == accId);

                            if (acc == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Accessibility = "NotFound" });
                            else
                            {
                                user.Accessibilities.Add(acc);
                            }
                        }
                    }
                  
                    var success = await _context.SaveChangesAsync() > 0;
                    if (success) return await _profileReader.ReadProfile(user.UserName);
                    throw new Exception("Problem saving changes");

                }
            }
        }
    }
}
