using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityJoinDetails
    {
        public Guid Id { get; set; }
        public string ViewUrl { get; set; }
        public string HostUrl { get; set; }
        public string ChannelName { get; set; }
        public Guid ActivityId { get; set; }
        public DateTime LastUpdateDate { get; set; }

    }
}
