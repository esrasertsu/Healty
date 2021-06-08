﻿using AutoMapper;
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

            var activityDto = new ActivityDto
            {
                Id = activity.Id,
                AttendanceCount = activity.AttendanceCount,
                AttendancyLimit = activity.AttendancyLimit,
                Date = activity.Date,
                Online = activity.Online,
                Description = activity.Description,
                Price = activity.Price,
                Title = activity.Title,
                Photos = activity.Photos,
                MainImage = activity.Photos.Where(x => x.IsMain == true).FirstOrDefault(),
                Levels = levelsDto,
                Categories = catsToReturn,
                SubCategories = subcatsToReturn,
                UserActivities = _mapper.Map<ICollection<UserActivity>, ICollection<AttendeeDto>>(activity.UserActivities),
                Address= activity.Address,
                City = _mapper.Map<City, CityDto>(activity.City),
                Venue = activity.Venue,
                Comments = _mapper.Map<ICollection<ActivityComment>, ICollection<ActivityCommentDto>>(activity.Comments),
                Videos = activity.Videos
            };

               

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
