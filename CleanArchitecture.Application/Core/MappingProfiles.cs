using System;
using System.Linq;
using System.Text.RegularExpressions;
using CleanArchitecture.Application.Activities;
using CleanArchitecture.Application.Activities.Administration;
using CleanArchitecture.Application.Blogs;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Comments;
using CleanArchitecture.Application.Contracts;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Application.User;
using CleanArchitecture.Domain;

namespace CleanArchitecture.Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, ActivityDto>() ;
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.UserRole, o => o.MapFrom(s => s.AppUser.Role))
                .ForMember(dest => dest.ShowName, o => o.MapFrom(s => s.ShowName))
                .ForMember(dest => dest.IsFollowing,
                    o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<ActivityCategories, CategoryDto>()
                .ForMember(dest => dest.Key, o => o.MapFrom(s => s.Category.Id))
                .ForMember(dest => dest.Text, o => o.MapFrom(s => s.Category.Name))
                .ForMember(dest => dest.Value, o => o.MapFrom(s => s.Category.Id));

            CreateMap<ActivitySubCategories, SubCategoryDto>()
             .ForMember(dest => dest.Key, o => o.MapFrom(s => s.SubCategory.Id))
             .ForMember(dest => dest.Text, o => o.MapFrom(s => s.SubCategory.Name))
             .ForMember(dest => dest.Value, o => o.MapFrom(s => s.SubCategory.Id));

            CreateMap<ActivityLevels, LevelDto>()
                        .ForMember(dest => dest.Key, o => o.MapFrom(s => s.Level.Id))
                        .ForMember(dest => dest.Text, o => o.MapFrom(s => s.Level.Name))
                        .ForMember(dest => dest.Value, o => o.MapFrom(s => s.Level.Id));

            CreateMap<Level, LevelDto>()
              .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
              .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
              .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

            CreateMap<ActivityReview, ActivityReviewDto>()
             .ForMember(d => d.ActivityName, o => o.MapFrom(s => s.Activity.Title))
             .ForMember(d => d.AuthorName, o => o.MapFrom(s => s.Author.UserName));

             CreateMap<Blog, BlogDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Photo, o => o.MapFrom(s => s.BlogImage.Url))
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.Category.Id))
                .ForMember(d => d.SubCategoryIds, o => o.MapFrom(s => s.SubCategories.Select(x => x.SubCategoryId).ToList()))
                .ForMember(d => d.UserImage, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Summary, o => o.MapFrom(s => s.Description.ScrubHtml().Truncate(100)))
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(d => d.SubCategoryNames, o => o.MapFrom(s => s.SubCategories.Select(x => x.SubCategory.Name).ToList()));

            CreateMap<Category, CategoryDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

            CreateMap<SubCategory, SubCategoryDto>()
              .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
              .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
              .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

              CreateMap<ActivityComment, ActivityCommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(
                    x => x.IsMain).Url));

               CreateMap<Contract, ContractDto>();

                CreateMap<City, CityDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

                 CreateMap<Message, ChatMessageDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Sender.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Sender.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(
                    x => x.IsMain).Url));
                CreateMap<Accessibility, AccessibilityDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

                CreateMap<AppUser, Profile>()
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Star, o => o.MapFrom(s => Convert.ToInt32(s.ReceivedComments.Count() > 0 ? s.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0)))
                .ForMember(d => d.IsFollowed,
                    o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)))
                .ForMember(dest => dest.FollowerCount, o => o.MapFrom(s => s.Followers.Count()))
                .ForMember(dest => dest.StarCount, o => o.MapFrom(s => Convert.ToInt32(s.ReceivedComments.Count() > 0 ? s.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0)))
                .ForMember(dest => dest.Role, o => o.MapFrom(s => s.Role.ToString()))
                .ForMember(dest => dest.FollowerCount, o => o.MapFrom(s => s.Followers.Count()));

                CreateMap<AppUser, AccountDto>()
               .ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()));
        }
    }

     public static class StringExtension
    {
        public static string Truncate(this string input, int strLength)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return input.Length <= strLength ? input : input.Substring(0, strLength);
        }

        public static string ScrubHtml(this string value)
        {
            var step1 = Regex.Replace(value, @"<[^>]+>|&nbsp;", "").Trim();
            var step2 = Regex.Replace(step1, @"\s{2,}", " ");
            return step2;
        }
    }
}