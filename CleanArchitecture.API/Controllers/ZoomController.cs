using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Zoom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    public class ZoomController : BaseController
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<string>> GenerateToken(Guid activityId, string meetingId, string role)
        {
            return await Mediator.Send(new GenerateToken.Query { ActivityId = activityId, MeetingId = meetingId, Role= role });
        }
    }
}
