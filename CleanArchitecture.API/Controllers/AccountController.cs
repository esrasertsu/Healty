using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.API.Dtos;
using CleanArchitecture.API.Services;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.User;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly IGoogleReCAPTCHAAccessor _reCAPTCHAAccessor;
        private readonly IEmailSender _emailSender;
        private readonly DataContext _context;
        private readonly IUserCultureInfo _userCultureInfo;


        public AccountController(UserManager<AppUser> userManager, TokenService tokenService,  IGoogleReCAPTCHAAccessor reCAPTCHAAccessor, IEmailSender emailSender, DataContext context, IUserCultureInfo userCultureInfo)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _emailSender = emailSender;
            _reCAPTCHAAccessor = reCAPTCHAAccessor;
            _context = context;
            _userCultureInfo = userCultureInfo;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(LoginDto loginDto)
        {
            var _googleReCAPTHA = await _reCAPTCHAAccessor.VerificateRecaptcha(loginDto.ReCaptcha);
            
            if (!_googleReCAPTHA.Success && _googleReCAPTHA.Score <= 0.5)
            {
               return Unauthorized();
            }
                
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.EmailOrUserName.Trim() || x.UserName == loginDto.EmailOrUserName.Trim());

            if (user == null) { 
  ModelState.AddModelError("EmailVerification", "Please check your inbox to confirm your email account."); 
                return ValidationProblem();            }
            
            if (!user.EmailConfirmed) { 
                ModelState.AddModelError("EmailVerification", "Please check your inbox to confirm your email account."); 
                return ValidationProblem();
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                    user.LastLoginDate =DateTime.UtcNow;
                    user.IsOnline = true;
                    await SetRefreshToken(user);
                    return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto request)
        {
            var _googleReCAPTHA = await _reCAPTCHAAccessor.VerificateRecaptcha(request.ReCaptcha);

             if (!_googleReCAPTHA.Success && _googleReCAPTHA.Score <= 0.5)
             {
                throw new RestException(HttpStatusCode.BadRequest, new { Email = "Geçersiz giriş." });
             }

            if (await _userManager.Users.AnyAsync(x => x.UserName == request.UserName))
            {
                ModelState.AddModelError("UserName", "Username taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == request.Email))
            {
                ModelState.AddModelError("Email", "Email taken");
                return ValidationProblem();
            }


                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email.Trim(),
                    UserName = request.UserName.Trim(),
                    Role = Role.User,
                    RegistrationDate = DateTime.UtcNow,
                    LastLoginDate = DateTime.UtcNow,
                    IsOnline = true
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) return BadRequest(result.Errors);

               var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                
                var origin = Request.Headers["origin"];
                var verifyUrl = $"{origin}/user/verifyEmail?token={token}&email={request.Email}";

                string FilePath = Directory.GetCurrentDirectory() + "/Templates/WelcomeTemplate.html";

                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.Email).Replace("[displayName]", request.DisplayName).Replace("[verifyUrl]", verifyUrl);

                //var message = $"<p>Merhaba,</p><p>Email adresini aşağıdaki linke tıklayarak doğrulayabilir ve siteye giriş yapabilirsiniz.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";
                var message = $"{MailText}";
                await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", message);

                return Ok("Kayıt başarılı - Giriş yapmak için lütfen email hesabınızdaki linki kullanınız.");
        }


        [AllowAnonymous]
        [HttpPost("registerWaitingTrainer")]
        public async Task<ActionResult<User>> RegisterWaitingTrainer([FromForm] RegisterWaitingTrainerDto request)
        {
            var origin = Request.Headers["origin"];
             if (await _userManager.Users.AnyAsync(x => x.UserName == request.UserName))
            {
                // ModelState.AddModelError("username", "Username taken");
                // return ValidationProblem();
               throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == request.Email))
            {
                // ModelState.AddModelError("email", "Email taken");
                // return ValidationProblem();
                 throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists."});
            }
            
                var phone = request.Phone.Trim();
                if (!phone.StartsWith("+"))
                    phone = "+" + phone;

                var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email.Trim(),
                        UserName = request.UserName.Trim(),
                        Role = Role.WaitingTrainer,
                        PhoneNumber = phone,
                        PhoneNumberConfirmed = true,
                        RegistrationDate = DateTime.Now,
                        IsOnline = true
                    };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

                await SetRefreshToken(user);

                if (request.CategoryIds != null)
                {
                    foreach (var catId in request.CategoryIds)
                    {
                        var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                        else
                        {
                            var userCategory = new UserCategories()
                            {
                                Category = cat,
                                AppUser = user
                            };
                            _context.UserCategories.Add(userCategory);
                        }
                    }
                }
                var result2 = await _context.SaveChangesAsync() > 0;

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{origin}/user/verifyEmail?token={token}&email={request.Email}";

                string FilePath = Directory.GetCurrentDirectory() + "/Templates/WelcomeTemplate.html";
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.Email).Replace("[displayName]", request.DisplayName).Replace("[verifyUrl]", verifyUrl);

                await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", MailText); 
            
            return CreateUserObject(user);
        }
        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            await SetRefreshToken(user);    
            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<User>> RefreshToken()
        {

            var refreshToken = Request.Cookies["refreshToken"];

            var user = await _userManager.Users
                .Include(r => r.RefreshTokens)
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));
           
            if(user == null) return Unauthorized();


            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive)
                throw new RestException(HttpStatusCode.Unauthorized);  //return Unauthorized();
                
            if(oldToken != null)
            {
               var inactiveTokens = user.RefreshTokens.Where(t => !t.Token.Equals(oldToken.Token)).ToList();
                foreach (var token in inactiveTokens)
                    {
                        if (_userCultureInfo.GetUserLocalTime() - token.LastRefreshed > TimeSpan.FromMinutes(9))
                        {
                            _context.RefreshTokens.Remove(token);
                        }
                    }

                    if (oldToken != null)
                    {
                        oldToken.Revoked =_userCultureInfo.GetUserLocalTime();
                    }
             }
              

            await SetRefreshToken(user);

            return CreateUserObject(user);
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