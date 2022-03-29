using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin
{
    public class Trainer
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool PhoneConfirmed { get; set; }
        public string SubMerchantKey { get; set; }
        public string SubMerchantType { get; set; }
        public string Title { get; set; }
        public string PhoneNumber { get; set; }
        public string Iban { get; set; }
        public bool HasVideo { get; set; }
        public bool HasPhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public string Role { get; set; }
        public string CommissionStatus { get; set; }
        public decimal ExperienceYear { get; set; }
        public string Experience { get; set; }
        public string Dependency { get; set; }//şirket , freelance vs
        public CityDto City { get; set; }
        public ICollection<AccessibilityDto> Accessibilities { get; set; }
        public ICollection<CategoryDto> Categories { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public int StarCount { get; set; }
        public int Star { get; set; }
        public bool HasConversation { get; set; }
        public bool IsOnline { get; set; }
        public int ResponseRate { get; set; }
        public ICollection<Certificate> Certificates { get; set; }
        public DateTime RegDate { get; set; }
        public DateTime LastLoginDate { get; set; }
        public DateTime? ApplicationDate { get; set; }
        public string CoverImage { get; set; }
        public int PastActivityCount { get; set; }
        public int FutureActivityCount { get; set; }
        public int BlogCount { get; set; }
        public int InteractionCount { get; set; }
        public string VideoUrl { get; set; }
        public DateTime? IyzicoContractSignedDate { get; set; }
        public DateTime LastProfileUpdatedDate { get; set; }
        public int ReceivedCommentCount { get; set; }
        public string SuggestedSubCategory { get; set; }

    }
}
