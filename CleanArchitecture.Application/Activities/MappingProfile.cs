using AutoMapper;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>() ;
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.UserRole, o => o.MapFrom(s => s.AppUser.Role))
                .ForMember(dest => dest.IsFollowing, o => o.MapFrom<FollowingResolver>());

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
        }
    }
}
