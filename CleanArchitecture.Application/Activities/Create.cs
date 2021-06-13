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
                var image = new Photo();
               
                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Address = request.Address,
                    Date = DateTime.Parse(request.Date),
                    Venue = request.Venue,
                    AttendancyLimit = String.IsNullOrEmpty(request.AttendancyLimit) ? 0 : Convert.ToInt32(request.AttendancyLimit),
                    AttendanceCount = 0,
                    Price = String.IsNullOrEmpty(request.Price) ? 0 : Convert.ToDecimal(request.Price),
                    Online = request.Online,
                     
                };
                if (!string.IsNullOrEmpty(request.CityId))
                {
                    var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == new Guid(request.CityId));
                    activity.SetCity(city);
                }
                else activity.SetCity(null);
                _context.Activities.Add(activity); //addsync is just for special creators

                if(request.Photo != null)
                {
                    var photoUploadResults = _photoAccessor.AddActivityImage(request.Photo);

                    activity.Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Url = photoUploadResults.Url,
                            Id = photoUploadResults.PublicId,
                            IsMain = true
                        }
                    };

                }
                
                if (request.CategoryIds != null)
                {
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

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendee = new UserActivity{
                    AppUser = user,
                    Activity = activity,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserActivities.Add(attendee);
                
                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return await _activityReader.ReadActivity(activity.Id);

                throw new Exception("Problem saving changes");
            }
        }
    }
}
