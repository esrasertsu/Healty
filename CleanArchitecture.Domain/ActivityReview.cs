using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityReview
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public int StarCount { get; set; }
        public string AuthorId { get; set; }
        public virtual AppUser Author { get; set; }
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Status { get; set; }
        public bool AllowDisplayName { get; set; }
    }
}
