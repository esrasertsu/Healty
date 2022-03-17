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
    public class AdminRequirement : IAuthorizationRequirement
    {
    }

    public class AdminRequirementHandler : AuthorizationHandler<AdminRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public AdminRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminRequirement requirement)
        {
            var currenUserRole = _httpContextAccessor.HttpContext.User?.Claims?
               .SingleOrDefault(x => x.Type == ClaimTypes.Role)?.Value;

            if (currenUserRole == "Admin")
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
