using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.User
{
    public class User
    {
        public User(AppUser user, IJwtGenerator jwtGenerator ,string refreshToken)
        {
            DisplayName = user.DisplayName;
            Token = jwtGenerator.CreateToken(user);
            UserName = user.UserName;
            Email = user.Email;
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url;
            Role = user.Role.ToString();
            RefreshToken = refreshToken;
        }

        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string Role { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}
