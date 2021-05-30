using CleanArchitecture.Application.Location;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class CityController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<CityDto>>> List()
        {
            return await Mediator.Send(new ListCities.Query());
        }

    }
}
