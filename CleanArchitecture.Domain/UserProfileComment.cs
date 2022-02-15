using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class UserProfileComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public int StarCount { get; set; }
        public string AuthorId { get; set; }
        public virtual AppUser Author { get; set; }
        public string TargetId { get; set; }
        public virtual AppUser Target { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Status { get; set; }
        public bool AllowDisplayName { get; set; }
        public bool Reported { get; set; }
        public string ReportedBy { get; set; }
        public DateTime ReportDate { get; set; }

    }
}
