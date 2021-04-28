using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class SubCatBlogs
    {
        public Guid SubCategoryId { get; set; }
        public virtual SubCategory SubCategory { get; set; }
        public Guid BlogId { get; set; }
        public virtual Blog Blog { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
