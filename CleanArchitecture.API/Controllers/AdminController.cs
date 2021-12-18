using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using CleanArchitecture.Domain;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.SubMerchants;
using CleanArchitecture.Application.Admin;

namespace CleanArchitecture.API.Controllers
{
    public class AdminController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List.SubMerchantListEnvelope>> List(int? limit, int? offset)
        {
            return await Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubMerchantDto>> Details(Guid id)
        {
            return await Mediator.Send(new GetSubMerchantFromIyzico.Query { Id = id });
        }

        [HttpGet("trainers")]
        public async Task<ActionResult<ListTrainers.TrainersEnvelope>> List(int? limit, int? offset, Guid? categoryId, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId, string role,string sort)
        {
            return await Mediator.Send(new ListTrainers.Query(limit, offset, categoryId, subCategoryIds, accessibilityId, cityId,role, sort));
        }

        [HttpGet("trainers/{username}")]
        public async Task<ActionResult<Trainer>> Get(string username)
        {
            return await Mediator.Send(new TrainerDetails.Query { UserName = username });
        }

        //[HttpGet("{username}/details")]
        //public async Task<ActionResult<Profile>> Get(string username)
        //{
        //    return await Mediator.Send(new Details.Query { UserName = username });
        //}

        //[HttpPost]
        //[Authorize(Policy = "CanCreateActivity")]
        //public async Task<ActionResult<ActivityDto>> Create([FromForm] Create.Command command)
        //{
        //    return await Mediator.Send(command);
        //}

        //[HttpPut("{id}")]
        //[Authorize(Policy = "IsActivityHost")]
        //public async Task<ActionResult<ActivityDto>> Update(Guid Id, [FromForm] Update.Command command)
        //{
        //    command.Id = Id;
        //    return await Mediator.Send(command);
        //}

        //[HttpDelete("{id}")]
        //[Authorize(Policy = "IsActivityHost")]
        //public async Task<ActionResult<Unit>> Delete(Guid Id)
        //{
        //    return await Mediator.Send(new Delete.Command { Id = Id });
        //}

        //[HttpPost("{id}/attend")]
        //public async Task<ActionResult<Unit>> Attend(Guid id, bool showName)
        //{
        //    return await Mediator.Send(new Attend.Command { Id = id, ShowName = showName });
        //}

        //[HttpDelete("{id}/attend")]
        //public async Task<ActionResult<Unit>> Unattend(Guid id)
        //{
        //    return await Mediator.Send(new Unattend.Command { Id = id });
        //}


        //[HttpGet("levels")]
        //[AllowAnonymous]
        //public async Task<ActionResult<List<LevelDto>>> List()
        //{
        //    return await Mediator.Send(new ListLevels.Query());
        //}

        //[HttpPut("{id}/joindetails")]
        //[Authorize(Policy = "IsActivityHost")]
        //public async Task<ActionResult<Unit>> UpdateJoinDetails(UpdateJoinDetails.Command command)
        //{
        //    return await Mediator.Send(command);
        //}


    }
}
