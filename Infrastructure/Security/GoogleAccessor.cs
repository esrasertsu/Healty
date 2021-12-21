using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.User;
using Google.Apis.Auth;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class GoogleAccessor : IGoogleAccessor
    {
        private readonly IOptions<GoogleLoginAppSettings> _settings;
        public GoogleAccessor(IOptions<GoogleLoginAppSettings> settings)
        {
            _settings = settings;
        }

        public async Task<GoogleLoginResponse> VerificateRecaptcha(string token)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { _settings.Value.ClientId }
            };
            var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
            
            return new GoogleLoginResponse()
            {
                Email = payload.Email,
                Name= payload.Name,
                Picture = payload.Picture,
                GivenName = payload.GivenName,
                FamilyName = payload.FamilyName,
                EmailVerified = payload.EmailVerified,
                Issuer = payload.Issuer,
                
            };
        }
    }
}
