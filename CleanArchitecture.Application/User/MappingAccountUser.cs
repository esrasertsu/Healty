using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class MappingAccountUser : AutoMapper.Profile
    {
        public MappingAccountUser()
        {
            CreateMap<AppUser, AccountDto>()
               .ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()));
        }
    }
}
