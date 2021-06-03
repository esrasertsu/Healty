using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivitySubCategories
    {
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public Guid SubCategoryId { get; set; }
        public virtual SubCategory SubCategory { get; set; }
    }
}
