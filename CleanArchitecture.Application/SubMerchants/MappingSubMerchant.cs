using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.SubMerchants
{
    public class MappingSubMerchant : Profile
    {
        public MappingSubMerchant()
        {
            CreateMap<Domain.SubMerchant, SubMerchantDto>()
                .ForMember(d => d.MerchantType, o => o.MapFrom(s => s.MerchantType.ToString()));

        }
    }
}
