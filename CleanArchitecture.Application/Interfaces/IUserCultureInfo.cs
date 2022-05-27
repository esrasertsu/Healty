using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IUserCultureInfo
    {
        DateTime ConvertToLocalTime(string date);
        DateTime GetUserLocalTime();
    }
}
