﻿using AutoMapper;
using CleanArchitecture.Application.Activities.Administration;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Comments;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
   
        public class ActivityReader : IActivityReader
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;


            public ActivityReader(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }

            public async Task<ActivityDto> ReadActivity(Guid activityId)
            {
                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == activityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not Found" });

                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var levelsDto = new List<LevelDto>();

                foreach (var level in activity.Levels)
                {
                    var accDto = new LevelDto
                    {
                        Key = level.Level.Id.ToString(),
                        Text = level.Level.Name,
                        Value = level.Level.Id.ToString(),
                    };

                levelsDto.Add(accDto);
                }

                var catsToReturn = new List<CategoryDto>();

                foreach (var cat in activity.Categories)
                {
                    var catDto = new CategoryDto
                    {
                        Key = cat.Category.Id.ToString(),
                        Text = cat.Category.Name,
                        Value = cat.Category.Id.ToString(),
                    };

                    catsToReturn.Add(catDto);
                }

                var subcatsToReturn = new List<SubCategoryDto>();

                foreach (var cat in activity.SubCategories)
                {
                    var catDto = new SubCategoryDto
                    {
                        Key = cat.SubCategory.Id.ToString(),
                        Text = cat.SubCategory.Name,
                        Value = cat.SubCategory.Id.ToString(),
                    };

                    subcatsToReturn.Add(catDto);
                }

            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            var activityDto = new ActivityDto
            {
                Id = activity.Id,
                AttendanceCount = activity.AttendanceCount,
                AttendancyLimit = activity.AttendancyLimit,
                Date = activity.Date,
                EndDate = activity.EndDate,
                Duration = activity.Duration,
                Online = activity.Online,
                Description = activity.Description,
                Price = activity.Price,
                Title = activity.Title,
                Photos = activity.Photos,
                MainImage = activity.Photos.Where(x => x.IsMain == true).FirstOrDefault(),
                Levels = levelsDto,
                Categories = catsToReturn,
                UserActivities = _mapper.Map<ICollection<UserActivity>, ICollection<AttendeeDto>>(activity.UserActivities),
                SavedCount = activity.UserSavedActivities != null ? activity.UserSavedActivities.Count() : 0,
                SubCategories = subcatsToReturn,
                Address= activity.Address,
                City = _mapper.Map<City, CityDto>(activity.City),
                Venue = activity.Venue,
                Comments = _mapper.Map<ICollection<ActivityComment>, ICollection<ActivityCommentDto>>(activity.Comments),
                Videos = activity.Videos,
                Star = activity.Star,
                StarCount = activity.StarCount,
                Status = activity.Status,
                TrainerId = host.AppUser.Id
    };
            if(activity.ActivityJoinDetails != null)
            {
                activityDto.HostUrl = activity.ActivityJoinDetails.HostUrl;
                activityDto.ViewUrl = activity.ActivityJoinDetails.ViewUrl;
                activityDto.RoomTitle = activity.ActivityJoinDetails.ChannelName;
            }
            if (host.AppUser.SubMerchantDetails != null)
            {
                activityDto.TrainerCompanyName = host.AppUser.SubMerchantDetails.MerchantType == MerchantType.Personal ? host.AppUser.SubMerchantDetails.ContactName : host.AppUser.SubMerchantDetails.LegalCompanyTitle;
                activityDto.TrainerPhone = host.AppUser.SubMerchantDetails.GsmNumber;
                activityDto.TrainerEmail = host.AppUser.SubMerchantDetails.Email;
                activityDto.TrainerAddress = host.AppUser.SubMerchantDetails.Address;
            }

            if (currentUser != null)
            {
               // activityDto.UserActivities = _mapper.Map<ICollection<UserActivity>, ICollection<AttendeeDto>>(activity.UserActivities.Where(x => x.IsHost || x.AppUser == currentUser || currentUser.Followings.Any(y => y.TargetId == x.AppUser.Id)).ToList());
                activityDto.IsSaved = activity.UserSavedActivities != null ? activity.UserSavedActivities.Any(x => x.AppUser == currentUser) : false;
                activityDto.HasCommentByUser = activity.Reviews != null ? activity.Reviews.Any(x => x.Author == currentUser) : false;
            }

            return activityDto;
            }


        
            public async Task<PersonalActivityDto> ReadPersonalActivity(Guid activityId)
             {
                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == activityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not Found" });

                var activityDto = new PersonalActivityDto
                {
                    Id = activity.Id,
                    AttendanceCount = activity.AttendanceCount,
                    AttendancyLimit = activity.AttendancyLimit,
                    Date = activity.Date,
                    EndDate = activity.EndDate,
                    Duration = activity.Duration,
                    Online = activity.Online,
                    Description = activity.Description,
                    Price = activity.Price,
                    Title = activity.Title,
                    MainImage = activity.Photos.Where(x => x.IsMain == true).FirstOrDefault(),
                    SavedCount = activity.UserSavedActivities != null ? activity.UserSavedActivities.Count() : 0,
                    City = _mapper.Map<City, CityDto>(activity.City),
                    TrainerApprovedDate = activity.TrainerApprovedDate,
                    AdminApprovedDate = activity.AdminApprovedDate,
                    Star = activity.Star,
                    StarCount = activity.StarCount,
                    Status = activity.Status
                };

            if (activity.ActivityJoinDetails != null)
            {
                activityDto.HostUrl = activity.ActivityJoinDetails.HostUrl;
                activityDto.ViewUrl = activity.ActivityJoinDetails.ViewUrl;
                activityDto.RoomTitle = activity.ActivityJoinDetails.ChannelName;
            }


            return activityDto;
            }



        public async Task<AdminActivityDto> ReadAdminActivity(Guid activityId)
        {
            var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == activityId);

            if (activity == null)
                throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var levelsDto = new List<LevelDto>();

            foreach (var level in activity.Levels)
            {
                var accDto = new LevelDto
                {
                    Key = level.Level.Id.ToString(),
                    Text = level.Level.Name,
                    Value = level.Level.Id.ToString(),
                };

                levelsDto.Add(accDto);
            }

            var catsToReturn = new List<CategoryDto>();

            foreach (var cat in activity.Categories)
            {
                var catDto = new CategoryDto
                {
                    Key = cat.Category.Id.ToString(),
                    Text = cat.Category.Name,
                    Value = cat.Category.Id.ToString(),
                };

                catsToReturn.Add(catDto);
            }

            var subcatsToReturn = new List<SubCategoryDto>();

            foreach (var cat in activity.SubCategories)
            {
                var catDto = new SubCategoryDto
                {
                    Key = cat.SubCategory.Id.ToString(),
                    Text = cat.SubCategory.Name,
                    Value = cat.SubCategory.Id.ToString(),
                };

                subcatsToReturn.Add(catDto);
            }

            var activityDto = new AdminActivityDto
            {
                Id = activity.Id,
                AttendanceCount = activity.AttendanceCount,
                AttendancyLimit = activity.AttendancyLimit,
                CreatedDate = activity.CreationDate,
                UpdatedDate = activity.LastUpdateDate,
                Date = activity.Date,
                EndDate = activity.EndDate,
                Duration = activity.Duration,
                Online = activity.Online,
                Description = activity.Description,
                Price = activity.Price,
                Title = activity.Title,
                Photos = activity.Photos,
                MainImage = activity.Photos.Where(x => x.IsMain == true).FirstOrDefault(),
                Levels = levelsDto,
                Categories = catsToReturn,
                UserActivities = _mapper.Map<ICollection<UserActivity>, ICollection<AttendeeDto>>(activity.UserActivities.Where(x => x.IsHost == false).ToList()),
                SavedCount = activity.UserSavedActivities != null ? activity.UserSavedActivities.Count() : 0,
                SubCategories = subcatsToReturn,
                Address = activity.Address,
                City = _mapper.Map<City, CityDto>(activity.City),
                Venue = activity.Venue,
                Comments = _mapper.Map<ICollection<ActivityComment>, ICollection<ActivityCommentDto>>(activity.Comments),
                TrainerUserName = activity.UserActivities.Where(x => x.IsHost).FirstOrDefault().AppUser.UserName,
                TrainerApprovedDate = activity.TrainerApprovedDate,
                TrainerDisplayName = activity.UserActivities.Where(x => x.IsHost).FirstOrDefault().AppUser.DisplayName,
                TrainerPhoneNumber = activity.UserActivities.Where(x => x.IsHost).FirstOrDefault().AppUser.PhoneNumber,
                AdminApprovedDate = activity.AdminApprovedDate,
//                Reviews = activity.Reviews, maple
                Star = activity.Star,
                StarCount = activity.StarCount,
                Status = activity.Status
            };

            if (activity.ActivityJoinDetails != null)
            {
                activityDto.HostUrl = activity.ActivityJoinDetails.HostUrl;
                activityDto.ViewUrl = activity.ActivityJoinDetails.ViewUrl;
                activityDto.RoomTitle = activity.ActivityJoinDetails.ChannelName;
            }

            return activityDto;
        }



        //private int GetStarCount(AppUser user)
        //{
        //    return Convert.ToInt32(user.ReceivedComments.Count() > 0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0);
        //}
        //private int CalculateStar(AppUser user)
        //{
        //    return Convert.ToInt32(user.ReceivedComments.Count() > 0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0);
        //}
        //private int CalculateResponseRate(AppUser user)
        //{
        //    var receivedFirstMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id).Count();
        //    var respondedMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.Messages.Any(x => x.SenderId == user.Id)).Count();

        //    var rate = 0;
        //    if (receivedFirstMessagesCount > 0)
        //        rate = Convert.ToInt32(100 * respondedMessagesCount / receivedFirstMessagesCount);
        //    return rate;
        //}
    }
}
