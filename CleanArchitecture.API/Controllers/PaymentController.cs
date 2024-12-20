﻿using CleanArchitecture.Application.Payment;
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

            query.Origin = Request.Headers["origin"];
            return await Mediator.Send(query);
        }
    
        [AllowAnonymous]
        [HttpPost("callback/{id}/{count}")]
        public async Task<RedirectResult> CallbackIyzicoPaymentStart(Guid id, int count,string uid,[FromForm] CallbackIyzicoPaymentStart.Command command)
        {
            command.Id = id;
            command.count = count;
            command.uid = uid;
            var result = await Mediator.Send(command);



            if (result.Status =="success")
            {
                var successUri = new Uri(Request.Scheme +"://"+Request.Host+"/payment/success?paymentId="+result.PaymentId+"&paymentTransactionId="+result.PaymentTransactionId+"&paidPrice="+result.PaidPrice+"&status="+result.Status+"&count="+count+ "&activityId=" + id+"");
                return Redirect(successUri.AbsoluteUri);
            }
            else
            {
                var uri = new Uri(Request.Scheme + "://" + Request.Host + "/payment/error?errorCode=" + result.ErrorCode + "&errorMessage=" + result.ErrorMessage +"");
                return Redirect(uri.AbsoluteUri);

            }

        }


        [HttpPost("refundPayment")]
        public async Task<ActionResult<RefundDto>> RefundPayment([FromForm] RefundPayment.Command command)
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                command.UserIpAddress = Request.Headers["X-Forwarded-For"];
            else
                command.UserIpAddress = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            return await Mediator.Send(command);
        }
    }
}
