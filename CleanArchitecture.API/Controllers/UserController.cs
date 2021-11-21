using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.SubMerchants;
using CleanArchitecture.Application.User;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    public class UserController : BaseController
    {

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            var user = await Mediator.Send(query);
            SetTokenCookie(user.RefreshToken);
            return user;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> Register(Register.Command command)
        {
            command.Origin = Request.Headers["origin"];
            await Mediator.Send(command);
            return Ok("Kayıt başarılı - Giriş yapmak için lütfen email hesabınızdaki linki kullanınız.");
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            var user = await Mediator.Send(new CurrentUser.Query());
            if(user!=null)
                SetTokenCookie(user.RefreshToken);
            return user;
        }

        [HttpGet("newTrainerInfo")]
        public async Task<ActionResult<WaitingTrainerInfoDto>> LoadWaitingTrainerInfo()
        {
            return await Mediator.Send(new WaitingTrainerInfo.Query());
           
        }

        [HttpGet("submerchantInfo")]
        public async Task<ActionResult<SubMerchantDto>> GetSubmerchantnfo()
        {
           return await Mediator.Send(new SubMerchantDetails.Query());
        }

        [HttpPost("createSubMerchant")]
        public async Task<ActionResult<bool>> CreateSubMerchant(CreateSubMerchant.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPut("editSubMerchant")]
        public async Task<ActionResult<bool>> EditSubMerchant(UpdateSubMerchant.Command command)
        {
            return await Mediator.Send(command);
        }


        [HttpPut]
        public async Task<ActionResult<Unit>> Update(bool status)
        {
            UpdateStatus.Command command = new UpdateStatus.Command{ Status = status };
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("registerWaitingTrainer")]
        public async Task<ActionResult<User>> RegisterWaitingTrainer([FromForm] RegisterWaitingTrainer.Command command)
        {
            command.Origin = Request.Headers["origin"];
            var user = await Mediator.Send(command);
            if (user != null)
                SetTokenCookie(user.RefreshToken);
            return user;
        }

        [AllowAnonymous]
        [HttpPost("registertrainer")]
        public async Task<ActionResult<Unit>> RegisterTrainer([FromForm]RegisterTrainer.Command command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("userNameAndPhoneCheck")]
        public async Task<ActionResult<bool>> UserNameAndPhoneCheck(string username, string email, string phone)
        {
            return await Mediator.Send(new IsUserNameAvailable.Query { UserName = username, Email = email, Phone = phone });
        }

        [AllowAnonymous]
        [HttpPost("sendSms")]
        public async Task<ActionResult<bool>> SendSms(string phoneNumber)
        {
            return await Mediator.Send(new SendSms.Query { PhoneNumber = phoneNumber });
        }

        [AllowAnonymous]
        [HttpPost("sendSmsVerification")]
        public async Task<ActionResult<bool>> SendSmsVerification(string phoneNumber, string code)
        {
            return await Mediator.Send(new SendSmsVerification.Query { PhoneNumber = phoneNumber, Code = code });
        }

        [AllowAnonymous]
        [HttpPost("facebook")]
        public async Task<ActionResult<User>> FacebookLogin(ExternalLogin.Query query)
        {
            var user = await Mediator.Send(query);
            SetTokenCookie(user.RefreshToken);
            return user;
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult<User>> RefreshToken(RefreshTokenHandler.Command command)
        {
            command.RefreshToken = Request.Cookies["refreshToken"];

            var user = await Mediator.Send(command);

            SetTokenCookie(user.RefreshToken);
            return user;
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<ActionResult> VerifyEmail(ConfirmEmail.Command command)
        {
            var result = await Mediator.Send(command);
            if (!result.Succeeded) return BadRequest("Email adres doğrulama hatası");
            return Ok("Email confirmed - you can now login");
        }

        [AllowAnonymous]
        [HttpPost("resendEmailVerification")]
        public async Task<ActionResult> ResendEmailVerification([FromQuery]ResendEmailVerification.Query query)
        {
            query.Origin = Request.Headers["origin"];
            await Mediator.Send(query);

            return Ok("Email verification link sent - please check email");
        }

        [AllowAnonymous]
        [HttpPost("resetPswRequest")]
        public async Task<ActionResult<bool>> ResetPasswordRequest([FromQuery]ResetPasswordRequest.Query query)
        {
            query.Origin = Request.Headers["origin"];
            var res = await Mediator.Send(query);

            return res;
        }

        [AllowAnonymous]
        [HttpGet("resetPassword")]
        public async Task<IdentityResult> ResetPassword([FromQuery]ResetPassword.Query query)
        {
            var result = await Mediator.Send(query);
            return result;
        }

        private void SetTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Secure = true
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
