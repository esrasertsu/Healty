using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class Login
    {
        public class Query : IRequest<User> {
            public string EmailOrUserName { get; set; }
            public string Password { get; set; }
            public string ReCaptcha { get; set; }

        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.EmailOrUserName).NotEmpty().WithMessage("Email veya kullanıcı adı girilmesi zorunludur");
                RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre girilmesi zorunludur.");
                RuleFor(x => x.ReCaptcha).NotEmpty().WithMessage("Erişim onaylanmadı.");

            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly DataContext _context;
            private readonly IGoogleReCAPTCHAAccessor _reCAPTCHAAccessor;
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, 
                IJwtGenerator jwtGenerator, DataContext context, IGoogleReCAPTCHAAccessor reCAPTCHAAccessor, IUserCultureInfo userCultureInfo)
            {
                _signInManager = signInManager;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _context = context;
                _reCAPTCHAAccessor = reCAPTCHAAccessor;
                _userCultureInfo = userCultureInfo;
            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var _googleReCAPTHA = await _reCAPTCHAAccessor.VerificateRecaptcha(request.ReCaptcha);

                if (!_googleReCAPTHA.Success && _googleReCAPTHA.Score <= 0.5)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Geçersiz giriş." });
                }

                var user = await _userManager.FindByEmailAsync(request.EmailOrUserName.Trim());

                if (user == null)
                {
                     user = await _userManager.FindByNameAsync(request.EmailOrUserName.Trim());
                     if(user == null)
                        throw new RestException(HttpStatusCode.BadRequest, new { Email = "Sistemde bu kullanıcı adı veya email adresiyle kayıtlı bir kullanıcı bulunamadı." });
                }

                if (!user.EmailConfirmed) throw new RestException(HttpStatusCode.BadRequest, new { EmailVerification = "Email doğrulaması gerçekleştirilmedi." });

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if(result.Succeeded)
                {
                    user.LastLoginDate =_userCultureInfo.GetUserLocalTime();
                    user.IsOnline = true;
                    var resfreshToken = _jwtGenerator.GenerateRefreshToken();
                    user.RefreshTokens.Add(resfreshToken);

                    await _userManager.UpdateAsync(user);

                    return new User(user, _jwtGenerator, resfreshToken.Token);
                }

                throw new RestException(HttpStatusCode.BadRequest, new { NotValid = "Email veya şifre hatalı." });
            }
        }
    }
}
