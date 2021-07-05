using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CleanArchitecture.Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public decimal ExperienceYear { get; set; }
        public string Experience { get; set; }
        public string Certificates { get; set; }
        public string Dependency { get; set; }//þirket , freelance vs
        public Role Role { get; set; }
        public virtual City City { get; set; }
        public string Bio { get; set; }
        public bool IsOnline { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserFollowing> Followings { get; set; }
        public virtual ICollection<UserFollowing> Followers { get; set; }
        public virtual ICollection<Blog> Blogs { get; set; }
        public virtual ICollection<UserProfileComment> ReceivedComments { get; set; }
        public virtual ICollection<UserProfileComment> SendComments { get; set; }
        public virtual ICollection<UserChatRooms> ChatRooms { get; set; }
        public virtual ICollection<UserAccessibility> UserAccessibilities { get; set; }
        public virtual ICollection<UserSubCategories> UserSubCategories { get; set; }
        public virtual ICollection<UserCategories> UserCategories { get; set; }
        public virtual ICollection<ReferencePic> ReferencePics { get; set; }
    }

    public enum Role
    {
        Admin = 100,
        User = 110,
        Trainer = 120
    }

}