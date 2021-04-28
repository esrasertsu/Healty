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
            CreateMap<Category, CategoryDto>();
        }
    }
}
