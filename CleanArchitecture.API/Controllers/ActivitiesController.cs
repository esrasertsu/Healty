using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using CleanArchitecture.Domain;
using CleanArchitecture.Application.Activities;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.User;
using CleanArchitecture.Application.Activities.Administration;

namespace CleanArchitecture.API.Controllers
{

    public class ActivitiesController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset,bool isGoing,bool isHost, bool isFollowed, bool isOnline, DateTime? startDate, DateTime? endDate,
                                                                     [FromQuery(Name = "categoryIds")] List<Guid> categoryIds, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds,
                                                                      [FromQuery(Name = "levelIds")] List<Guid> levelIds, Guid? cityId)
        {
            return await Mediator.Send(new List.Query(limit, offset, isGoing,isHost,isFollowed, isOnline,startDate, endDate,categoryIds, subCategoryIds, levelIds, cityId));
        }

        [HttpGet("personalActivities")]
        [Authorize(Policy = "CanCreateActivity")]
        public async Task<ActionResult<ListTrainerActivities.TrainerActivitiesEnvelope>> ListTrainerActivities(int? limit, int? offset, string userName, string status)
        {
            return await Mediator.Send(new ListTrainerActivities.Query(limit, offset, userName, status));
        }
        [HttpGet("{id}")]
        // [Authorize]
        [AllowAnonymous]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id});
        }
        [HttpPost]
        [Authorize(Policy = "CanCreateActivity")]
        public async Task<ActionResult<Unit>> Create([FromForm] Create.Command command)
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
        [Authorize]
        public async Task<ActionResult<Unit>> Attend(Guid id, bool showName)
        {
            return await Mediator.Send(new Attend.Command {Id = id, ShowName = showName});
        }

        [HttpDelete("{id}/attend")]
        [Authorize]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command { Id = id });
        }

        [HttpPost("{id}/save")]
        [Authorize]
        public async Task<ActionResult<Unit>> SaveActivity(Guid id)
        {
            return await Mediator.Send(new SaveActivity.Command { Id = id });
        }

        [HttpDelete("{id}/unsave")]
        [Authorize]
        public async Task<ActionResult<Unit>> UnSaveActivity(Guid id)
        {
            return await Mediator.Send(new UnSaveActivity.Command { Id = id });
        }


        [HttpGet("levels")]
        [AllowAnonymous]
        public async Task<ActionResult<List<LevelDto>>> List()
        {
            return await Mediator.Send(new ListLevels.Query());
        }
        
        [HttpPut("{id}/joindetails")]
        [Authorize]
        public async Task<ActionResult<Unit>> UpdateJoinDetails([FromForm]UpdateJoinDetails.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("saved")]
        [Authorize]
        public async Task<ActionResult<List<ActivityDto>>> ListSavedActivities()
        {
            return await Mediator.Send(new ListSavedActivities.Query());
        }

        [HttpPost("{id}/review")]
        [Authorize(Policy = "IsActivityAttendee")]
        public async Task<ActionResult<Unit>> CreateReview(CreateReview.Command command)
        {
            return await Mediator.Send(command);
        }
        [HttpPut("{id}/status")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> UpdateActivityStatus(Guid id, string status)
        {
            UpdateActivityStatus.Command command = new UpdateActivityStatus.Command { Id = id, Status = status };
            return await Mediator.Send(command);
        }
    }
}
