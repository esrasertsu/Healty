using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using CleanArchitecture.Domain;
using CleanArchitecture.Application.Blogs;
using Microsoft.AspNetCore.Authorization;

namespace CleanArchitecture.API.Controllers
{

    public class BlogController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<BlogDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BlogDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id});
        }
        [HttpPost]
        [Authorize(Policy = "CanCreateActivity")]
        public async Task<ActionResult<BlogDto>> Create([FromForm] Create.Command command)
        {
            return await Mediator.Send(command);
        }
        [HttpPut("{id}")]
     //   [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<BlogDto>> Update(Guid Id,Update.Command command)
        {
            command.Id = Id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        //[Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new Delete.Command { Id = Id });
        }

        // [HttpPost("{id}/attend")]
        // public async Task<ActionResult<Unit>> Attend(Guid id)
        // {
        //     return await Mediator.Send(new Attend.Command {Id = id});
        // }

        // [HttpDelete("{id}/attend")]
        // public async Task<ActionResult<Unit>> Unattend(Guid id)
        // {
        //     return await Mediator.Send(new Unattend.Command { Id = id });
        // }


    }
}
