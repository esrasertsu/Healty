using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ReferencePic
    {
        public string OriginalPublicId { get; set; }
        public string OriginalUrl { get; set; }
        public string ThumbnailPublicId { get; set; }
        public string ThumbnailUrl { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Title { get; set; }

    }
}
