using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Security.ReCaptcha
{
    public class ReCAPTHADataModel
    {
        public string Response { get; set; }
        public string Secret { get; set; }
    }
}
