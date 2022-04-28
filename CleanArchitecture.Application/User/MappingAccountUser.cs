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
            CreateMap<AppUser, AccountDto>(); 
        }
    }
}
