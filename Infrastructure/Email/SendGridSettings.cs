using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Email
{
    public class SendGridSettings
    {
        public string User { get; set; }
        public string ApiKey { get; set; }
    }
}
