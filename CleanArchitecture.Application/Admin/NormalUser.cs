using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin
{
    public class NormalUser
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public CityDto City { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool PhoneConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Role { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public bool IsOnline { get; set; }
        public DateTime RegDate { get; set; }
        public DateTime LastLoginDate { get; set; }
        public string CoverImage { get; set; }
        public int InteractionCount { get; set; }
        public DateTime? IyzicoContractSignedDate { get; set; }
        public DateTime LastProfileUpdatedDate { get; set; }

    }
}
