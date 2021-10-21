using CleanArchitecture.Application.Payment;
using CleanArchitecture.Application.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.API.Controllers
{
    public class PaymentController : BaseController
    {

        [HttpGet("activity/{id}/{count}")]
        [Authorize]
        public async Task<ActionResult<PaymentUserInfoDto>> GetPaymentUserInfo(string activityId, string count)
        {
            return await Mediator.Send(new GetPaymentUserInfo.Query { ActivityId = Guid.Parse(activityId), Count = Convert.ToInt32(count) });

        }

        [HttpPost("{id}/updateUserBeforePayment")]
        public async Task<ActionResult<bool>> UpdateUserDetailedInfo(UpdateUserDetailedInfo.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("{id}/paymentStart")]
        public async Task<ActionResult<PaymentThreeDResult>> StartIyzicoPayment(StartPayment.Query query)
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                 query.UserIpAddress = Request.Headers["X-Forwarded-For"];
            else
                query.UserIpAddress = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            return await Mediator.Send(query);
        }

        [AllowAnonymous]
        [HttpPost("callbackIyzicoPaymentStart")]
        public async Task<ActionResult<bool>> CallbackIyzicoPaymentStart(CallbackIyzicoPaymentStart.Command command)
        {
            var result = await Mediator.Send(command);
            return true;
        }
    }
}
