using CleanArchitecture.Application.Admin;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
        Task<Profile> ReadProfileCard(string username);
        Task<Trainer> ReadTrainerInfo(string username);

    }
}
