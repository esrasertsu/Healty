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
        public async Task<ActionResult<PaymentUserInfoDto>> GetActivityPaymentPage(string activityId, string count)
        {
            return await Mediator.Send(new GetPaymentUserInfo.Query { ActivityId = Guid.Parse(activityId), Count = Convert.ToInt32(count) });

        }

        [HttpPost("{id}/paymentpage")]
        public async Task<ActionResult<bool>> GetIyzicoPaymentPage(GetIyzicoPaymentPage.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("{id}/paymentStart")]
        public async Task<ActionResult<bool>> StartIyzicoPayment(StartPayment.Query query)
        {
            return await Mediator.Send(query);
        }

    }
}
