using CleanArchitecture.Application.User;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IGoogleReCAPTCHAAccessor
    {
        Task<ReCAPTHAResponse> VerificateRecaptcha(string token);
    }
}
