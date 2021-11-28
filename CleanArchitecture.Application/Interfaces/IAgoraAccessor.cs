using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IAgoraAccessor
    {
        string GenerateToken(string channelName, uint uid, uint expiredTs);

    }
}
