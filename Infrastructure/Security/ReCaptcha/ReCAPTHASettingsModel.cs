using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Security
{
    public class ReCAPTCHASettingsModel
    {
        public string SiteKey { get; set; }
        public string SecretKey { get; set; }

    }
}
