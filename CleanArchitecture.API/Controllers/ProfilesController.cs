using CleanArchitecture.Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}/details")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { UserName = username });
        }

        [HttpGet("role={role}")]
        public async Task<ActionResult<List<Profile>>> List(string role)
        {
            return await Mediator.Send(new ProfileList.Query { Role = role });
        }
    }
}
