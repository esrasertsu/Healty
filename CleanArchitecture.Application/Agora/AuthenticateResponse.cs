using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Agora
{
    public class AuthenticateResponse
    {
        public string channel { get; set; }

        public string uid { get; set; }

        public string token { get; set; }
    }
}
