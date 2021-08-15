using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public string AppUserId { get; set; } 
        public virtual Activity Activity { get; set; }
        public Guid ActivityId { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
