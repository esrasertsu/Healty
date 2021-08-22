using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Activity
    {
        public Guid Id {get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public virtual ICollection<ActivityCategories> Categories { get; set; }
        public virtual ICollection<ActivitySubCategories> SubCategories { get; set; }
        public bool Online { get; set; }
        public int? AttendancyLimit { get; set; }
        public int AttendanceCount { get; set; }
        public decimal? Price { get; set; }
        public DateTime Date { get; set; }
        public virtual City City { get; set; }
        public string Venue { get; set; }
        public string Address { get; set; }
        public virtual ActivityJoinDetails ActivityJoinDetails { get; set; }
        public virtual ICollection<ActivityLevels> Levels { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<ActivityComment> Comments { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Video> Videos { get; set; }


    }
}