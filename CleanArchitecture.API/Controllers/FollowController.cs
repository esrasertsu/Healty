using CleanArchitecture.Application.Follow;
using CleanArchitecture.Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    [Route("api/profiles")]   // api/profiles/{username}/follow
    public class FollowController : BaseController
    {
        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return await Mediator.Send(new Add.Command { Username = username });
        }

        [HttpDelete("{username}/follow")]
        public async Task<ActionResult<Unit>> UnFollow(string username)
        {
            return await Mediator.Send(new Delete.Command { Username = username });
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<Profile>>> GetFollowings(string username, string predicate)
        {
            return await Mediator.Send(new List.Query { Username = username, Predicate= predicate });
        }

    }
}
