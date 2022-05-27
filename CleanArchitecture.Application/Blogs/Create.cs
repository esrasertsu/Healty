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
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Blogs
{
    public class Create
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
                private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, IUserCultureInfo userCultureInfo)
                {
                    _context = context;
                    _mapper = mapper;
                    _userAccessor = userAccessor;
                    _photoAccessor = photoAccessor;
                  _userCultureInfo = userCultureInfo;
            }

                public async Task<BlogDto> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == request.CategoryId);
                    
                   if (category == null)
                          throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });

                var photoUploadResults = _photoAccessor.AddBlogPhoto(request.File);

                var image = new BlogImage
                {
                    Url = photoUploadResults.Url,
                    Id = photoUploadResults.PublicId
                };

                    var blog = new Blog
                    {
                        Id = request.Id,
                        Title = request.Title,
                        Description = request.Description,
                        Date =_userCultureInfo.GetUserLocalTime(),
                        Category = category,
                        Author = user,
                        BlogImage = image 
                    };

                    _context.Blogs.Add(blog); //addsync is just for special creators

                if(request.SubCategoryIds != null)
                foreach (var subCatId in request.SubCategoryIds)
                {
                    var subCat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == subCatId);
                    
                    if (subCat == null)
                        throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                    else
                    {
                        var subCatBlog = new SubCatBlogs
                        {
                            SubCategory = subCat,
                            Blog = blog,
                            DateCreated = _userCultureInfo.GetUserLocalTime()
                        };
                        _context.SubCatBlogs.Add(subCatBlog);
                    }
                }

                var success = await _context.SaveChangesAsync() > 0;


                if (success)
                    return _mapper.Map<BlogDto>(blog);

                throw new Exception("Problem saving changes");
                }
        }
    }
}
