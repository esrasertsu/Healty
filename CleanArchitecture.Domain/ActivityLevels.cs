using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityLevels
    {
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public Guid LevelId { get; set; }
        public virtual Level Level { get; set; }
    }
}
