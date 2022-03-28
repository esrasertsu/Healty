using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Activities.Administration
{
    public class ActivityReviewDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public int StarCount { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public Guid ActivityId { get; set; }
        public string ActivityName { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Status { get; set; }
        public bool AllowDisplayName { get; set; }
    }
}
