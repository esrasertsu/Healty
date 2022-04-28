using AutoMapper;
using CleanArchitecture.Application.Admin.Comments;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.UserProfileComments
{
    public class MappingUserProComments : Profile
    {
        public MappingUserProComments()
        {
            CreateMap<UserProfileComment, UserProfileCommentDto>()
                .ForMember(d => d.AuthorName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Target.UserName))
                .ForMember(d => d.Star, o => o.MapFrom(s => s.StarCount))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.IsReported, o => o.MapFrom<IsReportedResolver>())
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(
                    x => x.IsMain).Url));


            CreateMap<UserProfileComment, AdminProfileCommentsDto>()
                .ForMember(d => d.AuthorName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Target.UserName))
                .ForMember(d => d.Star, o => o.MapFrom(s => s.StarCount))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Target.DisplayName))
                .ForMember(d => d.Reports, o => o.MapFrom(s => s.Reports))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(
                    x => x.IsMain).Url));

        }
    }
}
