using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace CleanArchitecture.Domain
{
    public class AppUser : IdentityUser
    {

        public AppUser()
        {
            Photos = new Collection<Photo>();
            Orders = new Collection<Order>();
            RefreshTokens = new Collection<RefreshToken>();
        }
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Title { get; set; }
        public decimal ExperienceYear { get; set; }
        public string Experience { get; set; }
        public string Dependency { get; set; }//þirket , freelance vs
        public string Address { get; set; }
        public string SubMerchantKey { get; set; }
        public Role Role { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime LastLoginDate { get; set; }
        public DateTime? ApplicationDate { get; set; }
        public virtual City City { get; set; }
        public string Bio { get; set; }
        public string VideoUrl { get; set; }
        public bool IsOnline { get; set; }
        public int Star { get { return Convert.ToInt32(this.ReceivedComments.Count() > 0 ? this.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0); } } //rating
        public int StarCount { get { return Convert.ToInt32(this.ReceivedComments.Count() > 0 ? this.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0); } } //total rate votes ( bigger than zero) 
        public bool HasSignedIyzicoContract { get; set; }
        public DateTime? IyzicoContractSignedDate { get; set; }
        public bool HasSignedPaymentContract { get; set; }
        public DateTime? PaymentSignedDate { get; set; }
        public virtual SubMerchant SubMerchantDetails { get; set; }
        public virtual ICollection<ActivityComment> ActivityComments { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserFollowing> Followings { get; set; }
        public virtual ICollection<UserFollowing> Followers { get; set; }
        public virtual ICollection<Blog> Blogs { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<UserProfileComment> ReceivedComments { get; set; }
        public virtual ICollection<UserProfileComment> SendComments { get; set; }
        public virtual ICollection<UserChatRooms> ChatRooms { get; set; }
        public virtual ICollection<UserAccessibility> UserAccessibilities { get; set; }
        public virtual ICollection<UserSubCategories> UserSubCategories { get; set; }
        public virtual ICollection<UserCategories> UserCategories { get; set; }
        public virtual ICollection<ReferencePic> ReferencePics { get; set; }
        public virtual ICollection<Certificate> Certificates { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
   
    }

    public enum Role
    {
        Admin = 100,
        User = 110,
        Trainer = 120,
        WaitingTrainer = 130
    }

}