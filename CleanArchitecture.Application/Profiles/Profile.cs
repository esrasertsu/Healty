using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.Profiles
{
    public class Profile
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public string Role { get; set; }
        public decimal ExperienceYear { get; set; }
        public string Experience { get; set; }
        public string Certificates { get; set; }
        public string Dependency { get; set; }//şirket , freelance vs
        public CityDto City { get; set; }
        public ICollection<AccessibilityDto> Accessibilities { get; set; }
        public ICollection<CategoryDto> Categories { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; }

        [JsonPropertyName("isFollowing")]
        public bool IsFollowed { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public int StarCount { get; set; }
        public int Star { get; set; }
        public bool HasConversation { get; set; }
        public bool IsOnline { get; set; }
        public int ResponseRate { get; set; }

    }
}
