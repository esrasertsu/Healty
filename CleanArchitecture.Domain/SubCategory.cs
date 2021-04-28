using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class SubCategory
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual Category Category { get; set; }
        public virtual List<SubCatBlogs> Blogs { get; set; }

    }
}
