using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Photos;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult<Photo>> Add([FromForm]Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Delete([FromForm] Delete.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("{id}/setmain")]
        public async Task<ActionResult<Unit>> SetMain([FromForm] SetMain.Command command)
        {
            return await Mediator.Send(command);
        }

    }
}
