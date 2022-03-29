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
               .ForMember(d => d.TrainerCount, o => o.MapFrom(s => s.SubMerchants.Count));

        }
    }
   
}
