using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Blog
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public virtual Category Category { get; set; }
        public virtual List<SubCatBlogs> SubCategories { get; set; }
        public virtual BlogImage BlogImage { get; set; }
        public virtual AppUser Author { get; set; }
    }
}



