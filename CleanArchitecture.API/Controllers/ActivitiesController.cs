using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using CleanArchitecture.Domain;
using CleanArchitecture.Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace CleanArchitecture.API.Controllers
{

    public class ActivitiesController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset,bool isGoing,bool isHost, bool isFollowed, bool isOnline, DateTime? startDate, DateTime? endDate,
                                                                     [FromQuery(Name = "categoryIds")] List<Guid> categoryIds, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? cityId)
        {
            return await Mediator.Send(new List.Query(limit, offset, isGoing,isHost,isFollowed, isOnline,startDate, endDate,categoryIds, subCategoryIds, cityId));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id});
        }
        [HttpPost]
        [Authorize(Policy = "CanCreateActivity")]
        public async Task<ActionResult<ActivityDto>> Create([FromForm] Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<ActivityDto>> Update(Guid Id, [FromForm] Update.Command command)
        {
            command.Id = Id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new Delete.Command { Id = Id });
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command {Id = id});
        }

        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command { Id = id });
        }


        [HttpGet("levels")]
        [AllowAnonymous]
        public async Task<ActionResult<List<LevelDto>>> List()
        {
            return await Mediator.Send(new ListLevels.Query());
        }


    }
}
