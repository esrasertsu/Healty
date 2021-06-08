using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
 
    public interface IActivityReader
    {
        Task<ActivityDto> ReadActivity(Guid ActivityId);

    }
}
