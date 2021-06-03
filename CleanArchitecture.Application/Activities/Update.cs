using CleanArchitecture.Application.Errors;
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
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> Levels { get; set; }
            public DateTime? Date { get; set; }
            public Guid CityId { get; set; }
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
                RuleFor(x => x.CategoryIds).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();

            }
        }


        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
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


                if (request.Levels != null)
                {
                    var levels = await _context.ActivityLevels.Where(x => x.ActivityId == activity.Id).ToArrayAsync();
                    _context.ActivityLevels.RemoveRange(levels);

                    foreach (var level in request.Levels)
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
                if (request.CityId != null)
                {
                    var city = await _context.Cities.SingleOrDefaultAsync(x => x.Id == request.CityId);
                    activity.City = city ?? activity.City;
                }

                activity.Title = request.Title ?? activity.Title;
                activity.Description = request.Description ?? activity.Description;
                activity.Date = request.Date ?? activity.Date;
                activity.Venue = request.Venue ?? activity.Venue;



               // _context.Activities.Update(activity);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
