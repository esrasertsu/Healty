using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Validators;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace CleanArchitecture.Application.User
{
    public class Register
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Origin { get; set; }
            public string ReCaptcha { get; set; }


        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
                RuleFor(x => x.ReCaptcha).NotEmpty();

            }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IEmailSender _emailSender;
            private readonly IGoogleReCAPTCHAAccessor _reCAPTCHAAccessor;
            private IWebHostEnvironment _hostingEnvironment;

            public Handler(DataContext context, UserManager<AppUser> userManager, IEmailSender emailSender, IGoogleReCAPTCHAAccessor reCAPTCHAAccessor,IWebHostEnvironment environment)
            {
                _context = context;
                _userManager = userManager;
                _emailSender = emailSender;
                _reCAPTCHAAccessor = reCAPTCHAAccessor;
                _hostingEnvironment = environment;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var _googleReCAPTHA = await _reCAPTCHAAccessor.VerificateRecaptcha(request.ReCaptcha);

                if (!_googleReCAPTHA.Success && _googleReCAPTHA.Score <= 0.5)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Geçersiz giriş." });
                }

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists."});

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });

             
                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.UserName,
                    Role = Role.User,
                    RegistrationDate = DateTime.Now,
                    LastLoginDate = DateTime.Now,
                    IsOnline = true
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";

                string FilePath = Directory.GetCurrentDirectory() + "/Templates/WelcomeTemplate.html";

                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.Email).Replace("[displayName]", request.DisplayName).Replace("[verifyUrl]", verifyUrl);

                //var message = $"<p>Merhaba,</p><p>Email adresini aşağıdaki linke tıklayarak doğrulayabilir ve siteye giriş yapabilirsiniz.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";

                await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", MailText);

                return Unit.Value;
            }
         
        }
    }
}
