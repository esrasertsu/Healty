using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace CleanArchitecture.Application.Contracts
{
    public class MappingContracts : Profile
    {
        public MappingContracts()
        {
            CreateMap<Contract, ContractDto>();
        }

    }
}