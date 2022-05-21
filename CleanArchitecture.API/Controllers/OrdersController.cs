using CleanArchitecture.Application.Orders;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class OrdersController : BaseController
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List.OrdersEnvelope>> List(int? limit, int? offset, Guid? activityId, string predicate)
        {
            return await Mediator.Send(new List.Query(limit, offset, activityId,predicate));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new Delete.Command { Id = Id });
        }
    }
}
