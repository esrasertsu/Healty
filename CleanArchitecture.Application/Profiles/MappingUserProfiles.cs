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
                .ForMember(dest => dest.IsFollowed, o => o.MapFrom<FollowingResolver>()); 
        }
    }
}
