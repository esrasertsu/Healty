using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CleanArchitecture.Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public Role Role { get; set; }
        public string Bio { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserFollowing> Followings { get; set; }
        public virtual ICollection<UserFollowing> Followers { get; set; }
        public virtual ICollection<Blog> Blogs { get; set; }
        public virtual ICollection<UserProfileComment> ReceivedComments { get; set; }
        public virtual ICollection<UserProfileComment> SendComments { get; set; }
        public virtual ICollection<UserChatRooms> ChatRooms { get; set; }

    }

    public enum Role
    {
        Admin = 100,
        User = 110,
        Trainer = 120

    }

}