using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Sms
{
    public class TwilioSmsSettings
    {
        public string AccountSID { get; set; }
        public string AuthToken { get; set; }
        public string PhoneNumber { get; set; }
        public string ServiceSid { get; set; }

    }
}
