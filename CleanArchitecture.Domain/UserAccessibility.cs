using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class UserAccessibility
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid AccessibilityId { get; set; }
        public virtual Accessibility Accessibility { get; set; }
    }
}
