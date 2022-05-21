using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Payment
{
    public class PaymentApprovalDto
    {
        public string PaymentTransactionId { get; set; }
        public string Status { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorGroup { get; set; }
    }
}
