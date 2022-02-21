using CleanArchitecture.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class AttendeeRequirement : IAuthorizationRequirement
    {
    }

    public class AttendeeRequirementHandler : AuthorizationHandler<AttendeeRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public AttendeeRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AttendeeRequirement requirement)
        {
            var currenUserName = _httpContextAccessor.HttpContext.User?.Claims?
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x =>
                                            x.Key == "id").Value.ToString());

            var activity = _context.Activities.FindAsync(activityId).Result;

            var attendees = activity.UserActivities.Where(x => x.IsHost == false).ToList();

            var user = _context.Users.FirstOrDefault(x => x.UserName == currenUserName);

            if (attendees.Any(x => x.AppUser == user))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
