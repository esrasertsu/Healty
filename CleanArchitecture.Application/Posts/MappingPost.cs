using AutoMapper;
using CleanArchitecture.Domain;
using System.Linq;

namespace CleanArchitecture.Application.Posts
{
    public class MappingPost :  Profile
    {
        public MappingPost()
        {
            CreateMap<Post, PostDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

        }
    }
}

