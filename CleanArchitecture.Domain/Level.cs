using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Level
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ActivityLevels> Activities { get; set; }

    }
}
