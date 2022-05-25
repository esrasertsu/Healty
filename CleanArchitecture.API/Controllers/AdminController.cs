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
using CleanArchitecture.Application.Admin.Reviews;
using CleanArchitecture.Application.Admin.SubMerchants;
using CleanArchitecture.Application.Admin.Orders;

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
        public async Task<ActionResult<ListTrainers.TrainersEnvelope>> List(int? limit, int? offset, Guid? categoryId, [FromQuery(Name = "subCategoryIds")] List<Guid> subCategoryIds, Guid? accessibilityId, Guid? cityId,  string role,string sort)
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

        [HttpGet("profileComments")]
        public async Task<ActionResult<ListComments.UserProfileCommentsEnvelope>> GetUserComments(string username, bool status, int? limit, int? offset)
        {
            return await Mediator.Send(new ListComments.Query { Username = username, Limit = limit, Offset = offset, Status = status });
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

        [HttpGet("activityReviews")]
        public async Task<ActionResult<ListAllReviews.AllReviewsEnvelope>> GetAllActivityReviews(int? limit, int? offset, string userName, Guid activityId, bool status)
        {
            return await Mediator.Send(new ListAllReviews.Query(limit, offset, userName, activityId, status));
        }

        [HttpPut("activityReviews/{reviewId}")]
        public async Task<ActionResult<Unit>> UpdateReviewStatus(Guid reviewId, bool status)
        {
            UpdateActReviewStatus.Command command = new UpdateActReviewStatus.Command { ReviewId = reviewId, Status = status };
            return await Mediator.Send(command);
        }

        [HttpPut("profileComments/{commentId}")]
        public async Task<ActionResult<Unit>> GetUserComments(Guid commentId, bool status)
        {
            UpdateUserReviewStatus.Command command = new UpdateUserReviewStatus.Command { CommentId = commentId, Status = status };
            return await Mediator.Send(command);
        }

        [HttpPut("profileComments/revert")]
        public async Task<ActionResult<Unit>> RevertProfileComment(Guid commentId)
        {
            RevertCommentReport.Command command = new RevertCommentReport.Command { CommentId = commentId };
            return await Mediator.Send(command);
        }
        [HttpGet("commissionStat")]
        public async Task<ActionResult<List<CommissionStatusDto>>> ListAllCommissionStatus(string name)
        {
            return await Mediator.Send(new ListAllCommissionStatus.Query());
        }

        [HttpPost("commissionStat")]
        public async Task<ActionResult<CommissionStatusDto>> CreateCommissionStat(string name, string rate)
        {
            return await Mediator.Send(new CreateCommissionStat.Command { Name = name , Rate = rate });
        }

        [HttpDelete("commissionStat")]
        public async Task<ActionResult<Unit>> DeleteCommissionStat(Guid id)
        {
            return await Mediator.Send(new DeleteCommissionStat.Command { Id = id });
        }

        [HttpGet("commissionStat/{id}")]
        public async Task<ActionResult<CommissionStatusDto>> GetCommissionStatus(Guid id)
        {
            return await Mediator.Send(new GetCommissionStat.Query { Id = id });
        }
        [HttpPut("commissionStat")]
        public async Task<ActionResult<Unit>> UpdateCommissionStatus(Guid id, string name, string rate)
        {
            UpdateCommissionStat.Command command = new UpdateCommissionStat.Command { Id= id, Name= name, Rate=rate };
            return await Mediator.Send(command);
        }

        [HttpPut("commissionStat/addTrainer")]
        public async Task<ICollection<SubMerchantInfo>> AddSubMerchantToCommission([FromForm] AddSubMerchantToCommission.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("commissionStat/removeTrainer")]
        public async Task<ActionResult<SubMerchantInfo>> RemoveSubMerchantFromCommission([FromForm] RemoveSubMerchantFromCommission.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("paymentApprove")]
        public async Task<ActionResult<Unit>> AdminPaymentApprove(string paymentTransactionId, Guid orderItemId)
        {
            PaymentApprove.Command command = new PaymentApprove.Command { PaymentTransactionId= paymentTransactionId, OrderItemId= orderItemId };
            return await Mediator.Send(command);
        }

        [HttpPut("paymentDisapprove")]
        public async Task<ActionResult<Unit>> AdminPaymentDisapprove(string paymentTransactionId, Guid orderItemId)
        {
            PaymentDisapprove.Command command = new PaymentDisapprove.Command { PaymentTransactionId= paymentTransactionId, OrderItemId= orderItemId };
            return await Mediator.Send(command);
        }

    }
}
