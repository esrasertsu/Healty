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
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class Update
    {
        public class Command : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> LevelIds { get; set; }
            public string Date { get; set; }
            public string CityId { get; set; }
            public string Venue { get; set; }
            public bool Online { get; set; }
            public string AttendanceCount { get; set; }
            public string AttendancyLimit { get; set; }
            public string Price { get; set; }
            public string Address { get; set; }
            public virtual IFormFile Photo { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.CategoryIds).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();

            }
        }


        public class Handler : IRequestHandler<Command, ActivityDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IMapper _mapper;
            private readonly IActivityReader _activityReader;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _activityReader = activityReader;
            }


            public async Task<ActivityDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                if (request.CategoryIds != null)
                {
                    var userCats = await _context.ActivityCategories.Where(x => x.ActivityId == activity.Id).ToArrayAsync();
                    _context.ActivityCategories.RemoveRange(userCats);

                    foreach (var catId in request.CategoryIds)
                    {
                        var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                        else
                        {
                            var userCategory = new ActivityCategories()
                            {
                                Category = cat,
                                Activity = activity
                            };
                            _context.ActivityCategories.Add(userCategory);
                        }
                    }
                }


                if (request.SubCategoryIds != null)
                {
                    var userSubCats = await _context.ActivitySubCategories.Where(x => x.ActivityId == activity.Id).ToArrayAsync();
                    _context.ActivitySubCategories.RemoveRange(userSubCats);

                    foreach (var catId in request.SubCategoryIds)
                    {
                        var cat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { SubCategory = "NotFound" });
                        else
                        {
                            var userCategory = new ActivitySubCategories()
                            {
                                SubCategory = cat,
                                Activity = activity
                            };
                            _context.ActivitySubCategories.Add(userCategory);
                        }
                    }
                }


                if (request.LevelIds != null)
                {
                    var levels = await _context.ActivityLevels.Where(x => x.ActivityId == activity.Id).ToArrayAsync();
                    _context.ActivityLevels.RemoveRange(levels);

                    foreach (var level in request.LevelIds)
                    {
                        var lvl = await _context.Levels.SingleOrDefaultAsync(x => x.Id == level);

                        if (lvl == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Level = "NotFound" });
                        else
                        {
                            var aclev = new ActivityLevels()
                            {
                                Level = lvl,
                                Activity = activity
                            };
                            _context.ActivityLevels.Add(aclev);
                        }
                    }
                }
                if (!String.IsNullOrEmpty(request.CityId))
                {
                    var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == new Guid(request.CityId));
                    activity.SetCity(city ?? activity.GetCity());
                }
                else activity.SetCity(null);

                if (request.Photo!=null)
                {
                    var mainPhoto = activity.Photos.Where(x => x.IsMain).FirstOrDefault();
                    if (mainPhoto != null)
                    {
                        var result = _photoAccessor.DeletePhoto(mainPhoto.Id);
                        if (result != null)
                            activity.Photos.Remove(mainPhoto);
                    }

                    var photoUploadResults = _photoAccessor.AddBlogPhoto(request.Photo);

                    var image = new Photo
                    {
                        Url = photoUploadResults.Url,
                        Id = photoUploadResults.PublicId,
                        IsMain = true
                    };
                    activity.Photos.Add(image);

                }



                activity.Title = request.Title ?? activity.Title;
                activity.Description = request.Description ?? activity.Description;
                activity.Date = DateTime.Parse(request.Date);
                activity.Address = request.Address ?? activity.Address;
                activity.Venue = request.Venue ?? activity.Venue;
                activity.AttendancyLimit = String.IsNullOrEmpty(request.AttendancyLimit) ? 0 : Convert.ToInt32(request.AttendancyLimit);
                activity.AttendanceCount = Convert.ToInt32(request.AttendanceCount);
                activity.Price = String.IsNullOrEmpty(request.Price) ? 0 : Convert.ToDecimal(request.Price);
                activity.Online = Convert.ToBoolean(request.Online);

               // _context.Activities.Update(activity);
                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return await _activityReader.ReadActivity(activity.Id);
                else throw new RestException(HttpStatusCode.BadRequest, new { activity = "activity's already been updated" });

                throw new Exception("Problem saving changes");
            }
        }
    }
}
