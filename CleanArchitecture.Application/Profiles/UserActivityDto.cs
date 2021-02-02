using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

    }
}
