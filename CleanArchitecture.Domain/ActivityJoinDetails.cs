using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ActivityJoinDetails
    {
        public Guid Id { get; set; }
        public bool Zoom { get; set; }
        public string ActivityUrl { get; set; }
        public string MeetingId { get; set; }
        public string MeetingPsw { get; set; }
    }
}
