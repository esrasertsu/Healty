using System;
using CleanArchitecture.Application.Core;

namespace CleanArchitecture.Application.Activities.Requests
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHost { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}