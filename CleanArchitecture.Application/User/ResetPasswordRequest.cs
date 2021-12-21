using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class ResetPasswordRequest
    {
        public class Query : IRequest<bool>
        {
            public string Email { get; set; }
            public string Origin { get; set; }
            public string ReCaptcha { get; set; }

        }

        public class Handler : IRequestHandler<Query,bool>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IEmailSender _emailSender;
            private readonly IGoogleReCAPTCHAAccessor _reCAPTCHAAccessor;

            public Handler(UserManager<AppUser> userManager, IEmailSender emailSender, IGoogleReCAPTCHAAccessor reCAPTCHAAccessor)
            {
                _userManager = userManager;
                _emailSender = emailSender;
                _reCAPTCHAAccessor = reCAPTCHAAccessor;

            }

            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var _googleReCAPTHA = await _reCAPTCHAAccessor.VerificateRecaptcha(request.ReCaptcha);

                if (!_googleReCAPTHA.Success && _googleReCAPTHA.Score <= 0.5)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Geçersiz giriş." });
                }

                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                    return false;

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/resetPassword?token={token}&email={request.Email}";

                var message = $"<p>Merhaba,</p><p>Yeni şifrenizi oluşturmak için lütfen aşağıdaki linke tıklayınız.</p><p>Eğer bu istek size ait değilse lütfen mesajı dikkate almayınız.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";

                await _emailSender.SendEmailAsync(request.Email, "Şifre Yenileme", message);

                return true;
            }
        }
    }
}
