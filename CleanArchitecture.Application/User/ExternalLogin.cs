using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class ExternalLogin
    {
        public class Query : IRequest<AppUser>
        {
            public string AccessToken { get; set; }

        }

        public class Handler : IRequestHandler<Query, AppUser>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IFacebookAccessor _facebookAccessor;
            private readonly IUserCultureInfo _userCultureInfo;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor,
                IFacebookAccessor facebookAccessor, IUserCultureInfo userCultureInfo)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _facebookAccessor = facebookAccessor;
                _userCultureInfo = userCultureInfo;
            }
            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);

                if (userInfo == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });

                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if (user != null)
                {
                    user.LastLoginDate = _userCultureInfo.GetUserLocalTime();
                    user.IsOnline = true;
                    await _userManager.UpdateAsync(user);
                    return user;
                }

                user = new AppUser
                {
                    Id = userInfo.Id,
                    DisplayName = userInfo.Name,
                    Email = userInfo.Email,
                    UserName = "fb_" + userInfo.Id,
                    Role = Role.User,
                    EmailConfirmed = true,
                    Issuer = "Facebook"
                };

                var photo = new Photo
                {
                    Id = "fb_" + userInfo.Id,
                    Url = userInfo.Picture.Data.Url,
                    IsMain = true
                };

                user.Photos.Add(photo);
                user.RegistrationDate = _userCultureInfo.GetUserLocalTime();
                user.LastLoginDate = _userCultureInfo.GetUserLocalTime();
                user.IsOnline = true;

                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user" });

                return user;

            }
        }

    }
}
