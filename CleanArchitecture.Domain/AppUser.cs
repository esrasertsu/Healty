using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

    }
}