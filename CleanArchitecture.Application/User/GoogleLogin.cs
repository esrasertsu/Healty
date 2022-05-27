using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class GoogleLogin
    {
        public class Query : IRequest<User>
        {
            public string AccessToken { get; set; }

        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IGoogleAccessor _googleAccessor;
            private readonly IUserCultureInfo _userCultureInfo;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor, 
                IGoogleAccessor googleAccessor, IUserCultureInfo userCultureInfo)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _googleAccessor = googleAccessor;
                _userCultureInfo = userCultureInfo;
            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await _googleAccessor.VerificateRecaptcha(request.AccessToken);

                if (userInfo == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });

                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                var resfreshToken = _jwtGenerator.GenerateRefreshToken();

                if (user != null)
                {
                    user.LastLoginDate = _userCultureInfo.GetUserLocalTime();
                    user.IsOnline = true;
                    user.RefreshTokens.Add(resfreshToken);
                    await _userManager.UpdateAsync(user);
                    return new User(user, _jwtGenerator, resfreshToken.Token);
                }
                Random rnd = new Random();
                user = new AppUser
                {
                    DisplayName = userInfo.Name,
                    Email = userInfo.Email,
                    UserName = "g_" + userInfo.GivenName + "_" + userInfo.FamilyName + rnd.Next(1, 1000),
                    Role = Role.User,
                    EmailConfirmed = true,
                    Issuer = userInfo.Issuer
                };


                var photo = new Photo
                {
                    Id = "pic_" +user.UserName,
                    Url = userInfo.Picture,
                    IsMain = true
                };

                user.Photos.Add(photo);
                user.RefreshTokens.Add(resfreshToken);
                user.RegistrationDate = _userCultureInfo.GetUserLocalTime();
                user.LastLoginDate = _userCultureInfo.GetUserLocalTime();
                user.IsOnline = true;
                
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user" });


                return new User(user, _jwtGenerator, resfreshToken.Token);
            }
        }
    }
}
