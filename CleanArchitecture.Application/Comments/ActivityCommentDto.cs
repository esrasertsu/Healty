﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Comments
{
    public class ActivityCommentDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }

    }
}
