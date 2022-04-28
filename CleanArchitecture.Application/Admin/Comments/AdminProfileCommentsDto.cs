using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin.Comments
{
    public class AdminProfileCommentsDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public int Star { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; }
        public string AuthorName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public bool AllowDisplayName { get; set; }
        public bool Status { get; set; }
        public bool Reported { get; set; }
        public ICollection<ProfileCommentReports> Reports { get; set; }
    }
}
