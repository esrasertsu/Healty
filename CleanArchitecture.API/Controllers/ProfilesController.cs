using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Application.UserProfileComments;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}/details")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { UserName = username });
        }

        [HttpGet]
        public async Task<ActionResult<ProfileList.ProfilesEnvelope>> List(int? limit, int? offset, Guid? categoryId, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId)
        {
            return await Mediator.Send(new ProfileList.Query(limit, offset, categoryId, subCategoryIds,accessibilityId,cityId));
        }

        //[HttpGet]
        //public async Task<ActionResult<List<Profile>>> List()
        //{
        //    return await Mediator.Send(new ProfileList.Query { Role = role });
        //}

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate });
        }

        [HttpGet("{username}/blogs")]
        public async Task<ActionResult<ListBlogs.UserProfileBlogsEnvelope>> GetUserBlogs(string username, int? limit, int? offset)
        {
            return await Mediator.Send(new ListBlogs.Query { Username = username, Limit = limit, Offset = offset });
        }

        [HttpGet("{username}/comments")]
        public async Task<ActionResult<ListComments.UserProfileCommentsEnvelope>> GetUserComments(string username, int? limit, int? offset)
        {
            return await Mediator.Send(new ListComments.Query { Username = username , Limit= limit, Offset= offset});
        }

        [HttpPost]
        //     [Authorize(Policy = "CanCommentTrainer")]
        public async Task<ActionResult<UserProfileCommentDto>> CreateComment(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("message")]
        public async Task<ActionResult<Unit>> SendMessage(SendMessage.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("accessibilities")]
        public async Task<ActionResult<List<AccessibilityDto>>> GetAccessibilities()
        {
            return await Mediator.Send(new ListAccessibilities.Query());
        }

        [HttpPut]
        public async Task<ActionResult<Profile>> Edit([FromForm] Edit.Command command)
        {
            return await Mediator.Send(command);
        }

    }
}
