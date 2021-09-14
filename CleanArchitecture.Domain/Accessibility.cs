using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Accessibility
    {
        [MaxLength(255)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserAccessibility> UserAccessibilities { get; set; }

    }
}
