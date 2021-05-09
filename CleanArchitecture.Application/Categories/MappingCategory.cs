using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Categories
{
    public class MappingCategory : Profile
    {
        public MappingCategory()
        {
            CreateMap<Category, CategoryDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

            CreateMap<SubCategory, SubCategoryDto>()
              .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
              .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
              .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));
        }
    }
}
