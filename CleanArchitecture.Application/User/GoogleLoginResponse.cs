using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class GoogleLoginResponse
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string GivenName { get; set; }
        public string FamilyName { get; set; }
        public bool EmailVerified { get; set; }
        public string Issuer { get; set; }
    }
}
