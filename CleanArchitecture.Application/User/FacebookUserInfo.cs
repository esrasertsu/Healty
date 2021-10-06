using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class FacebookUserInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public FacebookPictureData Picture { get; set; }
    }
}
