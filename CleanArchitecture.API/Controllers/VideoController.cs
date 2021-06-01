using CleanArchitecture.Application.Videos;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class VideoController : BaseController
    {
        
            [HttpPost]
            public async Task<ActionResult<Video>> AddActivityVideo([FromForm] AddActivityVideo.Command command)
            {
                return await Mediator.Send(command);
            }

            [HttpDelete("{id}")]
            public async Task<ActionResult<Unit>> Delete(string id, Guid activityId)
            {
                return await Mediator.Send(new Delete.Command { Id = id, ActivityId = activityId });
            }

    }
}
