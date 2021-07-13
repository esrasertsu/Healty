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
            public Guid CityId { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<IFormFile> Certificates { get; set; }
            public IFormFile Photo { get; set; }

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


            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IPhotoAccessor photoAccessor, IDocumentAccessor documentAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _photoAccessor = photoAccessor;
                _documentAccessor = documentAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });
                
                try
                {
                    var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email,
                        UserName = request.UserName,
                        Role = Role.WaitingTrainer,
                        Bio = request.Description,
                        Dependency = request.Dependency,
                        ApplicationDate = DateTime.Now
                    };

                    var result = await _userManager.CreateAsync(user, request.Password);
                    

                    if (result.Succeeded)
                    {
                        var photoUploaded = false;
                        var docsUploaded = false;

                        var photoUploadResults = _photoAccessor.AddPhoto(request.Photo);

                        var photo = new Photo
                        {
                            Url = photoUploadResults.Url,
                            Id = photoUploadResults.PublicId,
                            IsMain = true
                        };
                        user.Photos = new List<Photo>();
                        user.Photos.Add(photo);
                        photoUploaded = true;

                        foreach (var item in request.Certificates)
                        {
                            var documentUploadResult = _documentAccessor.AddDocument(item);

                            var doc = new Certificate
                            {
                                Url = documentUploadResult.Url,
                                Id = documentUploadResult.PublicId,
                            };
                            user.Certificates = new List<Certificate>();
                            user.Certificates.Add(doc);
                        }
                        docsUploaded = true;

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

                        var success2 = await _context.SaveChangesAsync() > 0;

                        if (success2) return Unit.Value;
                        else
                        {
                            if (photoUploaded)
                                _photoAccessor.DeletePhoto(photoUploadResults.PublicId);
                            if (docsUploaded)
                                _documentAccessor.DeleteDocument(photoUploadResults.PublicId);


                            _context.Users.Remove(user);
                            var deletedNewUser = await _context.SaveChangesAsync() > 0;


                            if (deletedNewUser)
                            {
                                throw new Exception("Problem saving user data");

                            }else
                                throw new Exception("Problem deleting user data");


                        }

                    }

                    throw new Exception("Problem saving user main data");

                }
                catch (Exception)
                {

                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });
                }

                throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

            }
        }
    }
}
