using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            SetTokenCookie(user.RefreshToken);
            return user;
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Update(bool status)
        {
            UpdateStatus.Command command = new UpdateStatus.Command{ Status = status };
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("registertrainer")]
        public async Task<ActionResult<Unit>> RegisterTrainer([FromForm] RegisterTrainer.Command command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("isUserNameAvailable")]
        public async Task<ActionResult<bool>> IsUserNameAvailable(string username, string email)
        {
            return await Mediator.Send(new IsUserNameAvailable.Query { UserName = username, Email = email });
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
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
