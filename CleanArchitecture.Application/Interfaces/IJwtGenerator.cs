using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
        RefreshToken GenerateRefreshToken();
        string ReadToken(string token);
    }
}
