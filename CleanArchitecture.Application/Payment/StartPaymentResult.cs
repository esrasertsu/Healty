using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Payment
{
    public class StartPaymentResult
    {
        public string ContentHtml { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorGroup { get; set; }
        public string Request { get; set; }

    }
}
