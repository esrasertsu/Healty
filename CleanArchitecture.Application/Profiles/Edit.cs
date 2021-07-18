using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
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
            public List<IFormFile> Certificates { get; set; }
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
                private readonly IDocumentAccessor _documentAccessor;


                public Handler(DataContext context, IUserAccessor userAccessor, IProfileReader profileReader, IDocumentAccessor documentAccessor)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                    _profileReader = profileReader;
                    _documentAccessor = documentAccessor;
            }

            public async Task<Profile> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    user.DisplayName = request.DisplayName ?? user.DisplayName;
                    user.Dependency = request.Dependency ?? String.Empty;
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
                            user.City = city;
                        }
                    }

                    if (request.CategoryIds != null)
                    {
                        var userCats = await _context.UserCategories.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserCategories.RemoveRange(userCats);

                        foreach (var catId in request.CategoryIds)
                        {
                            var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                            if (cat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                            else
                            {
                                var userCategory = new UserCategories()
                                {
                                    Category = cat,
                                    AppUser = user
                                };
                                _context.UserCategories.Add(userCategory);
                            }
                        }
                    }


                    if (request.SubCategoryIds != null)
                    {
                        var userSubCats = await _context.UserSubCategories.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserSubCategories.RemoveRange(userSubCats);

                        foreach (var catId in request.SubCategoryIds)
                        {
                            var cat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == catId);

                            if (cat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { SubCategory = "NotFound" });
                            else
                            {
                                var userCategory = new UserSubCategories()
                                {
                                    SubCategory = cat,
                                    AppUser = user
                                };
                                _context.UserSubCategories.Add(userCategory);
                            }
                        }
                    }


                    if (request.Accessibilities != null)
                    {
                        var userAccs = await _context.UserAccessibilities.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserAccessibilities.RemoveRange(userAccs);

                        foreach (var accId in request.Accessibilities)
                        {
                            var acc = await _context.Accessibilities.SingleOrDefaultAsync(x => x.Id == accId);

                            if (acc == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Accessibility = "NotFound" });
                            else
                            {
                                var userCategory = new UserAccessibility()
                                {
                                    Accessibility = acc,
                                    AppUser = user
                                };
                                _context.UserAccessibilities.Add(userCategory);
                            }
                        }
                    }
                    if (request.Certificates != null)
                    {
                        user.Certificates = new List<Certificate>();

                        foreach (var item in request.Certificates)
                        {
                            var documentUploadResult = _documentAccessor.AddDocument(item);

                            var doc = new Certificate
                            {
                                Url = documentUploadResult.Url,
                                Id = documentUploadResult.PublicId,
                                Name = item.FileName,
                                ResourceType = documentUploadResult.ResourceType
                            };
                            user.Certificates.Add(doc);
                        }
                    }

                    try
                    {
                            var result = await _context.SaveChangesAsync() > 0;
                        if(result)
                            return await _profileReader.ReadProfile(user.UserName);
                        throw new Exception("Problem saving changes");


                    }
                    catch (Exception e)
                    {
                        throw new Exception("Problem saving changes",e);
                    }

                }
            }
        }
    }
}
