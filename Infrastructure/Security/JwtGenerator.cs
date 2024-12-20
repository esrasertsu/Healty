﻿using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;
        private readonly IUserCultureInfo _userCultureInfo;
        public JwtGenerator(IConfiguration configuration, IUserCultureInfo userCultureInfo)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));
            _userCultureInfo = userCultureInfo;
        }
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName), //    new Claim(ClaimTypes.NameIdentifier, user.UserName)
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            //generate signIn credentials
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = _userCultureInfo.GetUserLocalTime().AddMinutes(20), //10-15
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomNumber);
            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomNumber)
            };

        }

        public string ReadToken(string token)
        {
     
            var tokenHandler = new JwtSecurityTokenHandler();

            var result = tokenHandler.ReadJwtToken(token);

            return result.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.NameId).Value;

        }


    }


}
