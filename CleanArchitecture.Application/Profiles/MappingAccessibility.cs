using AutoMapper;
using CleanArchitecture.Domain;

namespace CleanArchitecture.Application.Profiles
{
    public class MappingAccessibility : AutoMapper.Profile
    {
        public MappingAccessibility()
        {
            CreateMap<Accessibility, AccessibilityDto>()
               .ForMember(d => d.Key, o => o.MapFrom(s => s.Id.ToString()))
               .ForMember(d => d.Text, o => o.MapFrom(s => s.Name))
               .ForMember(d => d.Value, o => o.MapFrom(s => s.Id.ToString()));
        }
    }
}
