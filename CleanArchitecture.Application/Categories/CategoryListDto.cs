using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Categories
{
    public class CategoryListDto
    {
        public string Key { get; set; }
        public string Text { get; set; }
        public string Value { get; set; }
        public string Parent { get; set; }
        public List<string> ChildNames { get; set; }
        public List<string> ChildIds { get; set; }
        public int BlogCount { get; set; }

    }
}
