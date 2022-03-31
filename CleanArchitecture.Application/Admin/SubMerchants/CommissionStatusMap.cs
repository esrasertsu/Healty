using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class CommissionStatusMap : AutoMapper.Profile
    {
        public CommissionStatusMap()
        {
            CreateMap<CommissionStatus, CommissionStatusDto>()
                .ForMember(d => d.Trainers, o => o.MapFrom(s => s.SubMerchants))
               .ForMember(d => d.TrainerCount, o => o.MapFrom(s => s.SubMerchants.Count));

            CreateMap<SubMerchant, SubMerchantInfo>()
             .ForMember(d => d.Role, o => o.MapFrom(s => s.User.Role.ToString()))
             .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
             .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName));
        }
    }
   
}
