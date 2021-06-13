using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Blogs
{
    public class UpdatePhoto
    {
        public class Command : IRequest<string>
        {
            public Guid Id { get; set; }
            public IFormFile Photo { get; set; }
        }

        public class Handler : IRequestHandler<Command, string>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                var blog = await _context.Blogs.FindAsync(request.Id);

                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new { blog = "Not Found" });


                if (request.Photo != null)
                {
                    if (blog.BlogImage != null)
                    {
                        var result = _photoAccessor.DeletePhoto(blog.BlogImage.Id);
                        if (result != null)
                        {
                            var photoUploadResults = _photoAccessor.AddBlogPhoto(request.Photo);

                            var image = new BlogImage
                            {
                                Url = photoUploadResults.Url,
                                Id = photoUploadResults.PublicId
                            };
                            blog.BlogImage = image;

                        }
                    }
                }

              //  _context.Blogs.Update(blog);

                var success = await _context.SaveChangesAsync() > 0;


                if (success)
                    return blog.BlogImage.Url;
                else throw new RestException(HttpStatusCode.BadRequest, new { blog = "Blog's already been updated" });

                throw new Exception("Problem saving changes");
            }
        }
    }
}
