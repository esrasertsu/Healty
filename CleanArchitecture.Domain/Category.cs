using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual List<Blog> Blogs { get; set; }
        public virtual List<SubCategory> SubCategories { get; set; }
    }
}
