using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
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
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName));
        }
    }
}
