using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Payment
{
    public class RefundDto
    {
        public string PaymentId { get; set; }
        public string PaymentTransactionId { get; set; }
        public string Price { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorGroup { get; set; }
    }
}
