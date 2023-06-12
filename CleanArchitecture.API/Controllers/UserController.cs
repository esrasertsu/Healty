using System;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.API.Services;
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
         private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public UserController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }
       
        [HttpGet("account")]
        public async Task<ActionResult<AccountDto>> GetAccountSettings()
        {
            return await Mediator.Send(new AccountSettings.Query());
        }

        [HttpPut("account")]
        public async Task<ActionResult<Unit>> EditAccountInfo([FromForm] UpdateAccountInfo.Command command)
        {
            return await Mediator.Send(command);
        }
        [HttpPut("contactInfo")]
        public async Task<ActionResult<Unit>> EditContactInfo([FromForm] UpdateContactInfo.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("password")]
        public async Task<ActionResult<Unit>> RefreshPassword([FromForm] RefreshPassword.Command command)
        {
            return await Mediator.Send(command);
        }


        [HttpGet("newTrainerInfo")]
        public async Task<ActionResult<WaitingTrainerInfoDto>> LoadWaitingTrainerInfo(string username)
        {
            return await Mediator.Send(new WaitingTrainerInfo.Query{ Username = username});
           
        }

        [HttpGet("submerchantInfo")]
        public async Task<ActionResult<SubMerchantDto>> GetSubmerchantnfo(string username)
        {
           return await Mediator.Send(new SubMerchantDetails.Query { Username = username });
        }

        [HttpPost("createSubMerchant")]
        public async Task<ActionResult<IyziSubMerchantResponse>> CreateSubMerchant(CreateSubMerchant.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPut("editSubMerchant")]
        public async Task<ActionResult<IyziSubMerchantResponse>> EditSubMerchant(UpdateSubMerchant.Command command)
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
        [HttpPost("registertrainer")]
        public async Task<ActionResult<Unit>> RegisterTrainer([FromForm]RegisterTrainer.Command command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("userNameAndPhoneCheck")]
        public async Task<ActionResult<bool>> UserNameAndPhoneCheck(string username, string email, string phone, string token)
        {
            return await Mediator.Send(new IsUserNameAvailable.Query { UserName = username, Email = email, Phone = phone, ReCaptcha = token });
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
            await SetRefreshToken(user);    
            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<ActionResult<User>> GoogleLogin(GoogleLogin.Query query)
        {
            var user = await Mediator.Send(query);
            await SetRefreshToken(user);    
            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
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

         private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions{
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        private User CreateUserObject(AppUser user)
        {
            return new User
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
            };
        }
    }
}
