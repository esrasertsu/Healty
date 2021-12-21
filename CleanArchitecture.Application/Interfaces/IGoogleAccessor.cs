using CleanArchitecture.Application.User;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IGoogleAccessor
    {
        Task<GoogleLoginResponse> VerificateRecaptcha(string token);
    }
}
