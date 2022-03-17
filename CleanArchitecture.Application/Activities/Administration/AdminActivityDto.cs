using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Comments;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.Activities.Administration
{
    public class AdminActivityDto
    {

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string TrainerUserName { get; set; }
        public string TrainerDisplayName { get; set; }
        public ICollection<CategoryDto> Categories { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; }
        public bool Online { get; set; }
        public string ChannelName { get; set; }
        public int AttendanceCount { get; set; }
        public int? AttendancyLimit { get; set; }
        public int SavedCount { get; set; }
        public decimal? Price { get; set; }
        public DateTime Date { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public CityDto City { get; set; }
        public string Venue { get; set; }
        public string Address { get; set; }
        public Photo MainImage { get; set; }

        [JsonPropertyName("attendees")]
        public ICollection<AttendeeDto> UserActivities { get; set; }
        public ICollection<ActivityCommentDto> Comments { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<LevelDto> Levels { get; set; }
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
