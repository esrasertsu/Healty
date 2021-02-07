using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.Profiles
{
    public class Profile
    {
        public string DisplayName { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public string Role { get; set; }

        [JsonPropertyName("isFollowing")]
        public bool IsFollowed { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public int StarCount { get; set; }
    }
}
