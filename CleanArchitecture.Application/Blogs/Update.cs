using AutoMapper;
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

namespace CleanArchitecture.Application.Blogs
{
    public class Update
    {
        public class Command : IRequest<BlogDto>
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public Guid CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, BlogDto>
        {
           private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IMapper _mapper;
                private readonly IPhotoAccessor _photoAccessor;
              public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
                {
                    _context = context;
                    _mapper = mapper;
                    _userAccessor = userAccessor;
                    _photoAccessor = photoAccessor;
            }

            public async Task<BlogDto> Handle(Command request, CancellationToken cancellationToken)
            {
                 var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                var blog = await _context.Blogs.FindAsync(request.Id);

                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new { blog = "Not Found" });

             var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == request.CategoryId);
                    
                   if (category == null)
                          throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });


                //if(request.File != null)
                //{
                //    var photoUploadResults = _photoAccessor.AddBlogPhoto(request.File);

                //    var image = new BlogImage
                //    {
                //        Url = photoUploadResults.Url,
                //        Id = photoUploadResults.PublicId
                //    };
                //     blog.BlogImage = image;
                //}

                //if (request.File != null)
                //{
                //    if (blog.BlogImage != null)
                //    {
                //        var result = _photoAccessor.DeletePhoto(blog.BlogImage.Id);
                //        if (result != null)
                //        {
                //            var photoUploadResults = _photoAccessor.AddBlogPhoto(request.File);

                //            var image = new BlogImage
                //            {
                //                Url = photoUploadResults.Url,
                //                Id = photoUploadResults.PublicId
                //            };
                //            blog.BlogImage = image;

                //        }  
                //    }
                //}


                blog.Title = request.Title ?? blog.Title;
                blog.Description = request.Description ?? blog.Description;
                blog.Category = category ?? blog.Category;
                
                _context.Blogs.Update(blog);

                if(request.SubCategoryIds != null)
                {
                    var subCatBlogs = await _context.SubCatBlogs.Where(x => x.BlogId == blog.Id).ToArrayAsync();
                    _context.SubCatBlogs.RemoveRange(subCatBlogs);

                    foreach (var subCatId in request.SubCategoryIds)
                    {
                        var subCat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == subCatId);

                        if (subCat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { SubCat = "NotFound" });
                        else
                        {
                            var subCatBlog = new SubCatBlogs
                            {
                                SubCategory = subCat,
                                Blog = blog,
                                DateCreated = DateTime.Now
                            };
                            _context.SubCatBlogs.Add(subCatBlog);
                        }
                    }
                }
                

                var success = await _context.SaveChangesAsync() > 0;


                if (success)
                    return _mapper.Map<BlogDto>(blog);
                else throw new RestException(HttpStatusCode.BadRequest, new { blog = "Blog's already been updated" });

                throw new Exception("Problem saving changes");
            }
        }
    }
}
