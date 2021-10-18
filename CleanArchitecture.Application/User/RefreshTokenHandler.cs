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
    public class RefreshTokenHandler
    {
        public class Command :IRequest<User>
        {
            public string RefreshToken { get; set; }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccessor = userAccessor;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                if(user == null) throw new RestException(HttpStatusCode.Unauthorized);

                var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == request.RefreshToken);

                if (oldToken != null && !oldToken.IsActive)
                    throw new RestException(HttpStatusCode.Unauthorized);

                var inactiveTokens = user.RefreshTokens.Where(t => !t.Token.Equals(oldToken.Token)).ToList();
                foreach (var token in inactiveTokens)
                    user.RefreshTokens.Remove(token);

                if (oldToken != null)
                {
                    oldToken.Revoked = DateTime.UtcNow;
                }

                var newRefreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(newRefreshToken);

                await _userManager.UpdateAsync(user);

                return new User(user, _jwtGenerator, newRefreshToken.Token);
            }
        }
    }
}
