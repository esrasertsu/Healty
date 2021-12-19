using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin
{
    public class Admin
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool PhoneConfirmed { get; set; }
        public string Title { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public string Role { get; set; }
        public DateTime RegDate { get; set; }
        public DateTime LastLoginDate { get; set; }
        public int BlogCount { get; set; }
    }
}
