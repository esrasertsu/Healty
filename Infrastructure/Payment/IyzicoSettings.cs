using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Payment
{
    public class IyzicoSettings
    {
        public string BaseUrl { get; set; }
        public string ApiKey { get; set; }
        public string SecretKey { get; set; }
    }
}
