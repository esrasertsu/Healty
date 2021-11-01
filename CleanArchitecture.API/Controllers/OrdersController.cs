using CleanArchitecture.Application.Orders;
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
        public async Task<ActionResult<List.OrdersEnvelope>> List(int? limit, int? offset)
        {
            return await Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }
    }
}
