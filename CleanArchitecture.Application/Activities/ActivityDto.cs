﻿using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Comments;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<CategoryDto>  Categories { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; }
        public bool Online { get; set; }
        public string HostUrl { get; set; }
        public string ViewUrl { get; set; }
        public string RoomTitle { get; set; }
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
        public bool IsSaved { get; set; }
        public bool HasCommentByUser { get; set; }

        [JsonPropertyName("attendees")]
        public ICollection<AttendeeDto> UserActivities { get; set; }
        public ICollection<ActivityCommentDto> Comments { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<LevelDto> Levels { get; set; }
        public ICollection<Video> Videos { get; set; }
        public int Star { get; set; }
        public int StarCount { get; set; }
        public ActivityStatus Status { get; set; }
        public string TrainerId { get; set; }
        public string TrainerCompanyName { get; set; }
        public string TrainerPhone { get; set; }
        public string TrainerEmail { get; set; }
        public string TrainerAddress { get; set; }

    }
}