using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Activities.Administration
{
    public class PersonalActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Online { get; set; }
        public int AttendanceCount { get; set; }
        public int? AttendancyLimit { get; set; }
        public int SavedCount { get; set; }
        public decimal? Price { get; set; }
        public DateTime Date { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public CityDto City { get; set; }
        public Photo MainImage { get; set; }
        public ActivityStatus Status { get; set; }
        public bool TrainerApproved { get; set; }
        public DateTime TrainerApprovedDate { get; set; }
        public bool AdminApproved { get; set; }
        public DateTime AdminApprovedDate { get; set; }

        public ICollection<ActivityReview> Reviews { get; set; }
        public int Star { get; set; }
        public int StarCount { get; set; }


    }
}
