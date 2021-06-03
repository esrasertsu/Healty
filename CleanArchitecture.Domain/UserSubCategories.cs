using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class UserSubCategories
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid SubCategoryId { get; set; }
        public virtual SubCategory SubCategory { get; set; }
    }
}
