using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Application.UserProfileComments;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { UserName = username });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ProfileList.ProfilesEnvelope>> List(int? limit, int? offset, Guid? categoryId, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId, string sort)
        {
            return await Mediator.Send(new ProfileList.Query(limit, offset, categoryId, subCategoryIds,accessibilityId,cityId, sort));
        }

        [HttpGet("popularList")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Profile>>> ListPopularProfiles(int? limit, int? offset, Guid? categoryId, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId, string sort)
        {
            return await Mediator.Send(new PopularProfilesList.Query(limit, offset, categoryId, subCategoryIds, accessibilityId, cityId, sort));
        }

        [HttpGet("{username}/activities")]
        [AllowAnonymous]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate });
        }

        [HttpGet("{username}/blogs")]
        [AllowAnonymous]
        public async Task<ActionResult<ListBlogs.UserProfileBlogsEnvelope>> GetUserBlogs(string username, int? limit, int? offset)
        {
            return await Mediator.Send(new ListBlogs.Query { Username = username, Limit = limit, Offset = offset });
        }

        [HttpGet("{username}/comments")]
        [AllowAnonymous]
        public async Task<ActionResult<ListComments.UserProfileCommentsEnvelope>> GetUserComments(string username, int? limit, int? offset)
        {
            return await Mediator.Send(new ListComments.Query { Username = username , Limit= limit, Offset= offset});
        }

        [HttpPost]
        //     [Authorize(Policy = "CanCommentTrainer")]
        public async Task<ActionResult<UserProfileCommentDto>> CreateComment(Application.UserProfileComments.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("message")]
        public async Task<ActionResult<ChatMessageDto>> SendMessage(SendMessage.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("accessibilities")]
        [AllowAnonymous]
        public async Task<ActionResult<List<AccessibilityDto>>> GetAccessibilities()
        {
            return await Mediator.Send(new ListAccessibilities.Query());
        }

        [HttpPut]
        public async Task<ActionResult<Profile>> Edit([FromForm] Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/referencepics")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ReferencePic>>> GetUserReferencePics(string username)
        {
            return await Mediator.Send(new ListReferencePics.Query { Username = username });
        }

        [HttpPost("referencepic")]
        public async Task<ActionResult<ReferencePic[]>> AddReferencePic([FromForm] AddReferencePic.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("coverpic")]
        public async Task<ActionResult<Photo>> AddCoverImage([FromForm] AddCoverImage.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("referencepic/{id}")]
        public async Task<ActionResult<Unit>> DeleteReferencePic(string id)
        {
            return await Mediator.Send(new DeleteReferencePic.Command { OriginalId = id });
        }


        [HttpDelete("documents/{id}")]
        public async Task<ActionResult<Unit>> DeleteDocument(string id)
        {
            return await Mediator.Send(new DeleteDocument.Command { Id = id });
        }

        [HttpPut("videoUrl")]
        public async Task<ActionResult<Unit>> AddVideoUrl(string url)
        {
            return await Mediator.Send(new AddVideoUrl.Command { VideoUrl = url });
        }
    }
}
