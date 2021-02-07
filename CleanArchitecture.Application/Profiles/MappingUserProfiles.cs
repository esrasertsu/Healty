using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.Profiles
{
    public class MappingUserProfiles : AutoMapper.Profile
    {
        public MappingUserProfiles()
        {
            CreateMap<AppUser, Profile>()
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.StarCount, o => o.MapFrom(s =>  Convert.ToInt32(s.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).Average())))
                .ForMember(dest => dest.IsFollowed, o => o.MapFrom<FollowingResolver>());
        }

    }
}


