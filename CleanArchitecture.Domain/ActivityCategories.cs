using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityCategories
    {
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}
