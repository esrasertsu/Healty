using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CleanArchitecture.Application.Contracts;
using MediatR;

namespace CleanArchitecture.API.Controllers
{
    public class ContractsController : BaseController
    {

        [HttpGet]
        [Authorize(Policy = "IsAdmin")]
        public async Task<ActionResult<List.ContractsEnvelope>> List(int? limit, int? offset)
        {
            return await Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ContractDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }
        [HttpGet("content/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> GetContent(string code)
        {
            return await Mediator.Send(new GetContent.Query { Code = code });
        }
        [HttpPost]
        [Authorize(Policy = "IsAdmin")]
        public async Task<ActionResult<Unit>> Create(string name, string code)
        {
            return await Mediator.Send(new Create.Command { Name = name, Code = code });
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "IsAdmin")]
        public async Task<ActionResult<ContractDto>> Update(Guid Id,[FromForm] Update.Command command)
        {
            command.Id = Id;
            return await Mediator.Send(command);
        }
    }
}
