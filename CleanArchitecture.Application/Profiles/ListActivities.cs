using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserActivityDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserActivities
                    .OrderBy(a => a.Activity.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        {
                            if (user.Role == Domain.Role.Trainer)
                                queryable = queryable.Where(a => a.Activity.Date <= DateTime.Now && a.IsHost);
                            else queryable = queryable.Where(a => a.Activity.Date <= DateTime.Now);
                        }
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        {
                            if (user.Role == Domain.Role.Trainer)
                                queryable = queryable.Where(a => a.Activity.Date >= DateTime.Now && a.IsHost);
                            else queryable = queryable.Where(a => a.Activity.Date >= DateTime.Now);
                        }
                        break;
                }

                var activities = queryable.ToList();
                var activitiesToReturn = new List<UserActivityDto>();

                foreach (var activity in activities)
                {
                    var userActivity = new UserActivityDto
                    {
                        Id = activity.Activity.Id,
                        Title = activity.Activity.Title,
                        // Category = activity.Activity.Category.Name,
                        Date = activity.Activity.Date,
                        Photo = activity.Activity.Photos.Count>0 ? activity.Activity.Photos.FirstOrDefault(x => x.IsMain).Url : ""
                    };

                    activitiesToReturn.Add(userActivity);
                }

                return activitiesToReturn;
            }
        }
    }
}