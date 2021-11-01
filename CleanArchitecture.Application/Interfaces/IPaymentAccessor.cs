using CleanArchitecture.Application.Payment;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IPaymentAccessor
    {
        string GetActivityPaymentPageFromIyzico(Activity activity, AppUser user, int count, string userIp);
        string PaymentProcessWithIyzico(Activity activity, AppUser user, int count, string userIp, string conversationId,
                                        string cardHolderName,string cardNumber, string cvc ,string expireMonth, string expireYear, 
                                        string subMerchantKey, string callbackUrl);
        IyzicoPaymentResult FinishPaymentWithIyzico(string conversationId, string paymentId, string conversationData);
        string CreateSubMerchantIyzico(SubMerchant subMerchant);
        string UpdateSubMerchantIyzico(SubMerchant subMerchant);

        SubMerchant GetSubMerchantFromIyzico(string subMerchantExternalId);

        RefundDto IyzicoRefund(string paymentTransactionId, string price, string ip);
    }
}
