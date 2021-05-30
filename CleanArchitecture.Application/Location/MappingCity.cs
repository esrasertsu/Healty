using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Location
{
    public class MappingCity : Profile
    {
        public MappingCity()
        {
            CreateMap<City, CityDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));

        }
    }
}
