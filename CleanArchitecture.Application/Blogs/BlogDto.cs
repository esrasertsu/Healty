using System;
using System.Collections.Generic;

namespace CleanArchitecture.Application.Blogs
{
    public class BlogDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string CategoryName { get; set; }
        public Guid CategoryId { get; set; }
        public List<Guid> SubCategoryIds { get; set; }
        public List<string> SubCategoryNames { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string UserImage { get; set; }
        public string Photo { get; set; }


    }
}