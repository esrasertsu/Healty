using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.SubMerchants
{
    public class IyziSubMerchantResponse
    {
        public bool Status { get; set; }
        public string ErrorMessage { get; set; }
        public string SubMerchantKey { get; set; }
    }
}
