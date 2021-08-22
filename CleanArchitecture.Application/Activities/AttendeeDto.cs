using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Activities
{
    public class AttendeeDto
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public bool IsHost { get; set; }
        public string UserRole { get; set; }
        public bool IsFollowing { get; set; }
        public bool ShowName { get; set; }

    }
}
