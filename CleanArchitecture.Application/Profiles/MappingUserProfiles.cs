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
                .ForMember(dest => dest.Star, o => o.MapFrom(s => Convert.ToInt32(s.ReceivedComments.Count() > 0 ? s.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0)))
                .ForMember(dest => dest.IsFollowed, o => o.MapFrom<FollowingResolver>())
                .ForMember(dest => dest.FollowerCount, o => o.MapFrom(s => s.Followers.Count()))
                .ForMember(dest => dest.StarCount, o => o.MapFrom(s => Convert.ToInt32(s.ReceivedComments.Count() > 0 ? s.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0)))
                .ForMember(dest => dest.Role, o => o.MapFrom(s => s.Role.ToString()))
                .ForMember(dest => dest.FollowerCount, o => o.MapFrom(s => s.Followers.Count()));

                
        }

    }
}
