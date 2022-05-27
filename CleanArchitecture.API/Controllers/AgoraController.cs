using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CleanArchitecture.Application.Agora;

namespace CleanArchitecture.API.Controllers
{
    public class AgoraController : BaseController
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<string>> GenerateToken(string channelName, Guid activityId)
        {
            return await Mediator.Send(new GenerateAgoraToken.Query { ChannelName = channelName, ActivityId= activityId });
        }

        [AllowAnonymous]
        [HttpGet("authorize")]
        public async Task<ActionResult<bool>> CanCreateMeeting(Guid activityId, string userName, string token)
        {
            return await Mediator.Send(new CanCreateAgoraMeeting.Query { ActivityId = activityId, UserName = userName , Token = token});
        }
    }
}
