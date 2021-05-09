using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.Blogs
{
    public class MappingBlog : Profile
    {
        public MappingBlog()
        {
            CreateMap<Blog, BlogDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Photo, o => o.MapFrom(s => s.BlogImage.Url))
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.Category.Id))
                .ForMember(d => d.SubCategoryIds, o => o.MapFrom(s => s.SubCategories.Select(x => x.SubCategoryId).ToList()))
                .ForMember(d => d.UserImage, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Summary, o => o.MapFrom(s => s.Description.Truncate(100)));

        }
       
    }

    public static class StringExtension
    {
        public static string Truncate(this string input, int strLength)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return input.Length <= strLength ? input : input.Substring(0, strLength);
        }
    }
}
