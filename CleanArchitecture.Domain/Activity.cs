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
        public virtual Category Category { get; set; }
        public virtual ICollection<SubCategory> SubCategories { get; set; }
        public Level Level { get; set; }
        public bool Online { get; set; }
        public int AttendanceCount { get; set; }
        public decimal? Price { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<ActivityComment> Comments { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }

    }
}


public enum Level
{
    Beginner = 10,
    MidLevel = 20,
    Expert = 30
}