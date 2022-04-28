using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ProfileCommentReports
    {
        public Guid Id { get; set; }
        public Guid UserProfileCommentId { get; set; }
        public string Body { get; set; }
        public string ReportedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
