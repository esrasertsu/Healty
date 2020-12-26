using AutoMapper;
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
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.UserRole, o => o.MapFrom(s => s.AppUser.Role));
        }
    }
}
