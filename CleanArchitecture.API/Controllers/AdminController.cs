using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using CleanArchitecture.Domain;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.SubMerchants;
using CleanArchitecture.Application.Admin;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Admin.Comments;
using CleanArchitecture.Application.Activities.Administration;

namespace CleanArchitecture.API.Controllers
{
    [Authorize(Policy = "IsAdmin")]
    public class AdminController : BaseController
    {
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

        [HttpPut("trainers/status")]
        public async Task<ActionResult<Unit>> UpdateTrainerStatus (string username, string status)
        {
            UpdateTrainerStatus.Command command = new UpdateTrainerStatus.Command { Username= username, Status = status };
            return await Mediator.Send(command);
        }

        [HttpDelete("trainers/{username}")]
        public async Task<ActionResult<Unit>> Delete(string username)
        {
            return await Mediator.Send(new DeleteTrainer.Command { Username = username });
        }

        [HttpGet("users")]
        public async Task<ActionResult<ListUsers.UsersEnvelope>> ListUsers(int? limit, int? offset, string role, string sort)
        {
            return await Mediator.Send(new ListUsers.Query(limit, offset, role, sort));
        }

        [HttpGet("admins")]
        public async Task<ActionResult<ListAdmins.AdminsEnvelope>> ListAdmins(int? limit, int? offset)
        {
            return await Mediator.Send(new ListAdmins.Query(limit, offset));
        }

        [HttpPost("newAdmin")]
        public async Task<ActionResult<Admin>> Create([FromForm] CreateAdmin.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/comments")]
        public async Task<ActionResult<ListComments.UserProfileCommentsEnvelope>> GetUserComments(string username, int? limit, int? offset)
        {
            return await Mediator.Send(new ListComments.Query { Username = username, Limit = limit, Offset = offset });
        }


        [HttpPost("subCategory")]
        public async Task<ActionResult<Unit>> CreateSubCategory(string name, string categoryId)
        {
            return await Mediator.Send(new CreateSubCategory.Command{ Name = name, CategoryId = categoryId });
        }

        [HttpDelete("subCategory/{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new DeleteSubCategory.Command { Id = Id });
        }

        [HttpGet("activities")]
        public async Task<ActionResult<ListAllActivities.AllActivitiesEnvelope>> ListTrainerActivities(int? limit, int? offset, string userName, string status)
        {
            return await Mediator.Send(new ListAllActivities.Query(limit, offset, userName, status));
        }

        [HttpGet("activities/{activityId}")]
        public async Task<ActionResult<AdminActivityDto>> GetActivity(Guid activityId)
        {
            return await Mediator.Send(new ActivityDetails.Query { ActivityId = activityId });
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
