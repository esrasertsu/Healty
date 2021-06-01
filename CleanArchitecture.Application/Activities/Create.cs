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
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public Guid CategoryId { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> Levels { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
            public bool Online { get; set; }
            public string AttendanceCount { get; set; }
            public string AttendancyLimit { get; set; }
            public string Price { get; set; }
            public virtual IFormFile Photo { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.CategoryId).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();

            }
        }

        public class Handler : IRequestHandler<Command>
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == request.CategoryId);

                var photoUploadResults = _photoAccessor.AddBlogPhoto(request.Photo);

                var image = new Photo
                {
                    Url = photoUploadResults.Url,
                    Id = photoUploadResults.PublicId,
                    IsMain = true
                };

                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = category,
                    Date = request.Date,
                    City = request.City,
                    Venue = request.Venue,
                    AttendancyLimit = String.IsNullOrEmpty(request.AttendancyLimit) ? 0 : Convert.ToInt32(request.AttendancyLimit),
                    AttendanceCount = 0,
                    Price = String.IsNullOrEmpty(request.Price) ? 0 : Convert.ToDecimal(request.Price),
                    Online = request.Online,
                     
                };
                _context.Activities.Add(activity); //addsync is just for special creators

                activity.Photos.Add(image);


                if (request.SubCategoryIds != null)
                    foreach (var subCatId in request.SubCategoryIds)
                    {
                        var subCat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == subCatId);

                        if (subCat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { SubCategory = "NotFound" });
                        else
                        {
                            activity.SubCategories.Add(subCat);
                        }
                    }
                if (request.Levels != null)
                {
                    foreach (var levelId in request.Levels)
                    {
                        var level = await _context.Levels.SingleOrDefaultAsync(x => x.Id == levelId);

                        if (level == null)
                            throw new RestException(HttpStatusCode.NotFound, new { level = "NotFound" });
                        else
                        {
                            activity.Levels.Add(level);
                        }
                    }
                }

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendee = new UserActivity{
                    AppUser = user,
                    Activity = activity,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserActivities.Add(attendee);
                
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
