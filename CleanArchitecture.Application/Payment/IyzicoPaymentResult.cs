using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Payment
{
    public class IyzicoPaymentResult
    {
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public string ConversationId { get; set; }
        public string PaymentId { get; set; }
        public string PaidPrice { get; set; }
        public string Currency { get; set; }
        public string PaymentTransactionId { get; set; }
        public string ItemId { get; set; }
        public string PaymentStatus { get; set; }
        public int? Installment { get; set; }
        public string Price { get; set; }
        public string Status { get; set; }

    }
}
