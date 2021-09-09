using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IPaymentAccessor
    {
        string GetActivityPaymentPageFromIyzico(Activity activity, AppUser user, int count);

    }
}
