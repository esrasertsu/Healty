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
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class Create
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
            public string EndDate { get; set; }
            public string Duration { get; set; }
            public string CityId { get; set; }
            public string Venue { get; set; }
            public bool Online { get; set; }
            public string AttendancyLimit { get; set; }
            public string Price { get; set; }
            public string Address { get; set; }
            public virtual IFormFile Photo { get; set; }
            public List<IFormFile> Photos { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.CategoryIds).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.EndDate).NotEmpty();

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

                //ekleyen kişi var mı yok mu

                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Address = request.Address,
                    Date = DateTime.Parse(request.Date),
                    EndDate = DateTime.Parse(request.EndDate),
                    Duration = string.IsNullOrEmpty(request.Duration) ? 0 : Convert.ToInt32(request.Duration),
                    Venue = request.Venue,
                    AttendancyLimit = string.IsNullOrEmpty(request.AttendancyLimit) ? 0 : Convert.ToInt32(request.AttendancyLimit),
                    AttendanceCount = 0,
                    Price = string.IsNullOrEmpty(request.Price) ? 0 : Convert.ToDecimal(request.Price),
                    Online = request.Online,
                    CreationDate = DateTime.Now
                     
                };
                if (!string.IsNullOrEmpty(request.CityId))
                {
                    var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == new Guid(request.CityId));
                    activity.City = city;
                }


                if (request.CategoryIds != null)
                {
                    // category user'ın categorisi mi
                    activity.Categories = new List<ActivityCategories>();

                    foreach (var catId in request.CategoryIds)
                    {
                        var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                        else
                        {
                            var userCategory = new ActivityCategories()
                            {
                                Category = cat
                            };
                            activity.Categories.Add(userCategory);
                        }
                    }
                }


                if (request.SubCategoryIds != null)
                {
                    activity.SubCategories = new List<ActivitySubCategories>();

                    foreach (var catId in request.SubCategoryIds)
                    {
                        var cat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { SubCategory = "NotFound" });
                        else
                        {
                            var userCategory = new ActivitySubCategories()
                            {
                                SubCategory = cat
                            };
                            activity.SubCategories.Add(userCategory);
                        }
                    }
                }


                if (request.LevelIds != null)
                {
                    activity.Levels = new List<ActivityLevels>();
                    foreach (var level in request.LevelIds)
                    {
                        var lvl = await _context.Levels.SingleOrDefaultAsync(x => x.Id == level);

                        if (lvl == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Level = "NotFound" });
                        else
                        {
                            var aclev = new ActivityLevels()
                            {
                                Level = lvl
                            };
                            activity.Levels.Add(aclev);
                        }
                    }
                }

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendee = new UserActivity
                {
                    AppUser = user,
                    IsHost = true,
                    DateJoined = DateTime.Now,
                    ShowName = true
                };

                activity.UserActivities = new List<UserActivity>();
                activity.UserActivities.Add(attendee);

                activity.Photos = new List<Photo>();

                if (request.Photos != null)
                {
                    for (int i = 0; i < request.Photos.Count; i++)
                    {
                        var photoUploadResults = _photoAccessor.AddActivityImage(request.Photos[i]);

                        var image = new Photo
                        {
                            Url = photoUploadResults.Url,
                            Id = photoUploadResults.PublicId,
                            IsMain = false
                        };
                        if (i == 0)
                            image.IsMain = true;
                        activity.Photos.Add(image);
                    }
                }
               

                await _context.Activities.AddAsync(activity); //addsync is just for special creators

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return await _activityReader.ReadActivity(activity.Id);

                throw new Exception("Problem saving changes");
            }
        }
    }
}
