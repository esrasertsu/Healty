using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Validators;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class RegisterTrainer
    {
        public class Command : IRequest<Unit>
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Description { get; set; }
            public string Dependency { get; set; }
            public decimal ExperienceYear { get; set; }
            public string Experience { get; set; }
            public string Title { get; set; }
            public string PhoneNumber { get; set; }
            public bool HasSignedContract { get; set; }
            public Guid CityId { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public string SuggestedSubCategory { get; set; }
            public List<Guid> AccessibilityIds { get; set; }
            public List<IFormFile> NewCertificates { get; set; }
            public List<string> DeletedCerts { get; set; }

            public bool SendToRegister { get; set; }
        }


        //public class CommandValidator : AbstractValidator<Command>
        //{
        //    public CommandValidator()
        //    {
        //        RuleFor(x => x.DisplayName).NotEmpty();
        //        RuleFor(x => x.UserName).NotEmpty();
        //        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        //        RuleFor(x => x.Password).Password();
        //        RuleFor(x => x.CategoryIds).NotEmpty();
        //        RuleFor(x => x.SubCategoryIds).NotEmpty();
        //        RuleFor(x => x.Certificates).NotEmpty();
        //        RuleFor(x => x.Photo).NotEmpty();

        //    }
        //}
        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IDocumentAccessor _documentAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context, UserManager<AppUser> userManager,
                IJwtGenerator jwtGenerator, IPhotoAccessor photoAccessor, IDocumentAccessor documentAccessor,
                IUserAccessor userAccessor, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _photoAccessor = photoAccessor;
                _documentAccessor = documentAccessor;
                _userAccessor = userAccessor;
                _userCultureInfo = userCultureInfo;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });


                if (user.Role != Role.Admin && user.UserName != request.UserName)
                    throw new RestException(HttpStatusCode.Unauthorized);

                if (user.UserName != request.UserName) //current user requestteki trainer değilse
                    user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);
                try
                {
                    if (request.SendToRegister)
                        user.Role = Role.UnderConsiTrainer;

                    user.DisplayName = request.DisplayName;
                    user.Bio = request.Description;
                    user.Dependency = request.Dependency;
                    user.ApplicationDate = _userCultureInfo.GetUserLocalTime();
                    user.ExperienceYear = Convert.ToDecimal(request.ExperienceYear) > 0 ? Convert.ToDecimal(request.ExperienceYear) : user.ExperienceYear;
                    user.LastProfileUpdatedDate = _userCultureInfo.GetUserLocalTime();
                    user.Title = request.Title;
                    user.SuggestedSubCategory = request.SuggestedSubCategory;

                    var docsUploaded = false;

                    user.Certificates = new List<Certificate>();


                    if (request.NewCertificates != null) //yeni eklenenler
                    {
                        foreach (var item in request.NewCertificates)
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
                        docsUploaded = true;
                    }

                    if (request.DeletedCerts != null) //silinenler
                    {

                        foreach (var item in request.DeletedCerts)
                        {
                            var photo = user.Certificates.Where(x => x.Id == item).FirstOrDefault();
                            if (photo != null)
                            {
                                var result = _documentAccessor.DeleteDocument(photo.Id, photo.ResourceType);
                                if (result != null)
                                    user.Certificates.Remove(photo);
                            }
                        }
                    }
                        

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
                    else
                    {
                        user.City = null;
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
                    else
                    {
                        var userCats = await _context.UserCategories.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserCategories.RemoveRange(userCats);

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
                    else
                    {
                        var userSubCats = await _context.UserSubCategories.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserSubCategories.RemoveRange(userSubCats);

                    }


                    if (request.AccessibilityIds != null)
                    {
                        var userAccs = await _context.UserAccessibilities.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserAccessibilities.RemoveRange(userAccs);

                        foreach (var accId in request.AccessibilityIds)
                        {
                            var acc = await _context.Accessibilities.SingleOrDefaultAsync(x => x.Id == accId);

                            if (acc == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Accessibility = "NotFound" });
                            else
                            {
                                var userAccessibility = new UserAccessibility()
                                {
                                    Accessibility = acc,
                                    AppUser = user
                                };
                                _context.UserAccessibilities.Add(userAccessibility);
                            }
                        }
                    }else
                    {
                        var userAccs = await _context.UserAccessibilities.Where(x => x.AppUserId == user.Id).ToArrayAsync();
                        _context.UserAccessibilities.RemoveRange(userAccs);
                    }

                        try
                        {
                            var result = await _context.SaveChangesAsync() > 0;
                            if (result)
                                return Unit.Value;
                            else
                            {
                                if (docsUploaded)
                                {
                                    foreach (var item in user.Certificates)
                                    {
                                        _documentAccessor.DeleteDocument(item.Id, item.ResourceType);
                                    }

                                }
                                throw new Exception("Problem saving changes");

                            }


                        }
                        catch (Exception e)
                        {
                            throw new Exception("Problem saving changes", e);
                        }

                }
                catch (Exception ex)
                {

                    throw new RestException(HttpStatusCode.BadRequest, new { Trainer = ex});
                }


            }
        }
    }
}
