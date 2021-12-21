using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using IyzipayCore;
using IyzipayCore.Model;
using IyzipayCore.Request;
using CleanArchitecture.Domain;
using System.Net;
using System.Linq;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Payment;
using CleanArchitecture.Application.SubMerchants;

namespace Infrastructure.Payment
{
    public class PaymentAccessor : IPaymentAccessor
    {
        private readonly IyzipayCore.Options _options;
        public PaymentAccessor(IOptions<IyzicoSettings> config)
        {
            _options = new IyzipayCore.Options();
            _options.ApiKey = config.Value.ApiKey;
            _options.SecretKey = config.Value.SecretKey;
            _options.BaseUrl = config.Value.BaseUrl;
        }

        public IyziSubMerchantResponse CreateSubMerchantIyzico(CleanArchitecture.Domain.SubMerchant subMerchantDomain)
        {
            var conversaitonId = Guid.NewGuid().ToString(); 
            CreateSubMerchantRequest request = new CreateSubMerchantRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = conversaitonId;
            request.SubMerchantExternalId = subMerchantDomain.Id.ToString();
            request.Address = subMerchantDomain.Address;
            request.ContactName = subMerchantDomain.ContactName;
            request.ContactSurname = subMerchantDomain.ContactSurname;
            request.Email = subMerchantDomain.Email;
            request.GsmNumber = subMerchantDomain.GsmNumber;
            request.Name = subMerchantDomain.Name;
            request.Iban = subMerchantDomain.Iban;
            request.IdentityNumber = subMerchantDomain.IdentityNumber;
            request.Currency = Currency.TRY.ToString();

            if (subMerchantDomain.MerchantType == MerchantType.Personal)
                request.SubMerchantType = SubMerchantType.PERSONAL.ToString();
            else if (subMerchantDomain.MerchantType == MerchantType.LimitedOrAnonim)
            {
                request.SubMerchantType = SubMerchantType.PRIVATE_COMPANY.ToString();
                request.TaxOffice = subMerchantDomain.TaxOffice;
                request.LegalCompanyTitle = subMerchantDomain.LegalCompanyTitle;
            }
            else if (subMerchantDomain.MerchantType == MerchantType.Private)
            {
                request.SubMerchantType = SubMerchantType.LIMITED_OR_JOINT_STOCK_COMPANY.ToString();
                request.TaxOffice = subMerchantDomain.TaxOffice;
                request.TaxNumber = subMerchantDomain.TaxNumber;
                request.LegalCompanyTitle = subMerchantDomain.LegalCompanyTitle;
            }
            else return new IyziSubMerchantResponse()
            {
                ErrorMessage = "Alt üye iş yeri seçimi hatalı",
                Status = false,
                SubMerchantKey = null
            };


            IyzipayCore.Model.SubMerchant subMerchant = IyzipayCore.Model.SubMerchant.Create(request, _options);

            if (subMerchant.ConversationId == conversaitonId && subMerchant.Status == "success")
            {
               return new IyziSubMerchantResponse()
               {
                   ErrorMessage = null,
                   Status = true,
                   SubMerchantKey = subMerchant.SubMerchantKey
               };
            }
            else return new IyziSubMerchantResponse()
            {
                ErrorMessage = subMerchant.ErrorMessage,
                Status = false,
                SubMerchantKey = null
            };
        }

        public IyziSubMerchantResponse UpdateSubMerchantIyzico(CleanArchitecture.Domain.SubMerchant subMerchantDomain)
        {
            var conversaitonId = Guid.NewGuid().ToString();

            UpdateSubMerchantRequest request = new UpdateSubMerchantRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = conversaitonId;
            request.SubMerchantKey = subMerchantDomain.SubMerchantKey;
            request.Iban = subMerchantDomain.Iban;
            request.Address = subMerchantDomain.Address;
            request.ContactName = subMerchantDomain.ContactName;
            request.ContactSurname = subMerchantDomain.ContactSurname;
            request.Email = subMerchantDomain.Email;
            request.GsmNumber = subMerchantDomain.GsmNumber;
            request.Name = subMerchantDomain.Name;
            request.IdentityNumber = subMerchantDomain.IdentityNumber;
            request.Currency = Currency.TRY.ToString();

            if (subMerchantDomain.MerchantType == MerchantType.LimitedOrAnonim)
            {
                request.TaxOffice = subMerchantDomain.TaxOffice;
                request.LegalCompanyTitle = subMerchantDomain.LegalCompanyTitle;
            }
            else if (subMerchantDomain.MerchantType == MerchantType.Private)
            {
                request.TaxOffice = subMerchantDomain.TaxOffice;
                request.TaxNumber = subMerchantDomain.TaxNumber;
                request.LegalCompanyTitle = subMerchantDomain.LegalCompanyTitle;
            }

            IyzipayCore.Model.SubMerchant subMerchant = IyzipayCore.Model.SubMerchant.Update(request, _options);

            if (subMerchant.ConversationId == conversaitonId && subMerchant.Status == "success")
                return new IyziSubMerchantResponse()
                {
                    ErrorMessage = null,
                    Status = true,
                    SubMerchantKey = subMerchant.SubMerchantKey
                };
            else return new IyziSubMerchantResponse()
            {
                ErrorMessage = subMerchant.ErrorMessage,
                Status = false,
                SubMerchantKey = null
            };
        }


        public IyzicoPaymentResult FinishPaymentWithIyzico(string conversationId, string paymentId, string conversationData)
        {
            CreateThreedsPaymentRequest request = new CreateThreedsPaymentRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = conversationId;
            request.PaymentId = paymentId;// "1";
            request.ConversationData = conversationData;// "conversation data";
            
            ThreedsPayment threedsPayment = ThreedsPayment.Create(request, _options);

            if(threedsPayment.ConversationId == conversationId)
            {
                return new IyzicoPaymentResult()
                {
                    ConversationId = threedsPayment.ConversationId ?? "",
                    PaymentStatus = threedsPayment.PaymentStatus ?? "",
                    PaymentTransactionId = threedsPayment.PaymentItems !=null ? threedsPayment.PaymentItems.Select(x => x.PaymentTransactionId).FirstOrDefault() : "",
                    ErrorCode = threedsPayment.ErrorCode ?? "",
                    ErrorMessage = threedsPayment.ErrorMessage ?? "",
                    Status = threedsPayment.Status ?? "",
                    Currency = threedsPayment.Currency ?? "",
                    Installment = threedsPayment.Installment ?? 1,
                    ItemId = threedsPayment.PaymentItems != null ? threedsPayment.PaymentItems.Select(x => x.ItemId).FirstOrDefault() : "",
                    PaidPrice = threedsPayment.PaidPrice ?? "",
                    PaymentId = threedsPayment.PaymentId ?? "",
                    Price = threedsPayment.Price ?? "",
                    CardFamily = threedsPayment.CardFamily ?? "",
                    CardType = threedsPayment.CardType ?? "",
                    CardAssociation = threedsPayment.CardAssociation ?? ""
                };
            }

            throw new RestException(HttpStatusCode.BadRequest, new { ThreedsPayment = "Iyzico conversation Id error" });


        }

        public string GetActivityPaymentPageFromIyzico(Activity activity, AppUser user, int count, string userIp)
        {
            CreateCheckoutFormInitializeRequest request = new CreateCheckoutFormInitializeRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = Guid.NewGuid().ToString();
            request.Price = (activity.Price * count).ToString().Split(',')[0];
            request.PaidPrice = (activity.Price * count).ToString().Split(',')[0];
            request.Currency = Currency.TRY.ToString();
            request.PaymentGroup = PaymentGroup.LISTING.ToString();
            request.CallbackUrl = "https://www.merchant.com/callback";

            List<int> enabledInstallments = new List<int>();
            enabledInstallments.Add(2);
            enabledInstallments.Add(3);
            enabledInstallments.Add(6);
            enabledInstallments.Add(9);
            request.EnabledInstallments = enabledInstallments;

            Buyer buyer = new Buyer();
            buyer.Id = user.Id;
            buyer.Name = user.Name;
            buyer.Surname = user.Surname;
            buyer.GsmNumber = user.PhoneNumber;
            buyer.Email = user.Email;
            buyer.IdentityNumber = "11111111111";
            buyer.RegistrationAddress = user.Address;
            buyer.Ip = userIp;//"85.34.78.112";
            buyer.City = user.City.Name;
            buyer.Country = "Turkey";
            request.Buyer = buyer;

            //BENIM FATURA BILGILERİM
            Address billingAddress = new Address();
            billingAddress.ContactName = "Esra Sertsu";
            billingAddress.City = "Istanbul";
            billingAddress.Country = "Turkey";
            billingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            billingAddress.ZipCode = "34742";
            request.BillingAddress = billingAddress;

            List<BasketItem> basketItems = new List<BasketItem>();
            BasketItem firstBasketItem = new BasketItem();
            firstBasketItem.Id = activity.Id.ToString();
            firstBasketItem.Name = activity.Title;
            firstBasketItem.Category1 = "Activity";
            firstBasketItem.Category2 = activity.Categories.Select(x => x.Category.Name).FirstOrDefault();
            firstBasketItem.ItemType = BasketItemType.VIRTUAL.ToString();
            firstBasketItem.Price = (activity.Price * count).ToString().Split(',')[0];
            firstBasketItem.SubMerchantKey = "G2FCFycIof0paTP6687dOoch9Tc=";
            firstBasketItem.SubMerchantPrice = (activity.Price * 80 /100 * count).ToString().Split(',')[0];
            basketItems.Add(firstBasketItem);

            request.BasketItems = basketItems;
            var a  = request.ToString();
            CheckoutFormInitialize checkoutFormInitialize = CheckoutFormInitialize.Create(request, _options);
            var b = checkoutFormInitialize.ToString();
            return checkoutFormInitialize.PaymentPageUrl;
        }

        public StartPaymentResult PaymentProcessWithIyzico(Activity activity, AppUser user, int count, string userIp, string conversationId, 
            string cardHolderName, string cardNumber, string cvc, string expireMonth, string expireYear, string subMerchantKey, string callbackUrl)
        {

            CreatePaymentRequest request = new CreatePaymentRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = conversationId;
            request.Price = RemoveTrailingZeros((activity.Price * count).ToString().Split(',')[0]);
            request.PaidPrice = RemoveTrailingZeros((activity.Price * count).ToString().Split(',')[0]);
            request.Currency = Currency.TRY.ToString();
            request.Installment = 1;
            request.BasketId = "B67832";
            request.PaymentChannel = PaymentChannel.WEB.ToString();
            request.PaymentGroup = PaymentGroup.PRODUCT.ToString();
            request.CallbackUrl = callbackUrl; //verify Email sayfası gibi olcak içerik

            PaymentCard paymentCard = new PaymentCard();
            paymentCard.CardHolderName = cardHolderName;
            paymentCard.CardNumber =cardNumber;
            paymentCard.ExpireMonth = expireMonth;
            paymentCard.ExpireYear = expireYear;
            paymentCard.Cvc = cvc;
            paymentCard.RegisterCard = 0;
            request.PaymentCard = paymentCard;

            Buyer buyer = new Buyer();
            buyer.Id = user.Id;
            buyer.Name = user.Name;
            buyer.Surname = user.Surname;
            buyer.GsmNumber = user.PhoneNumber;
            buyer.Email = user.Email;
            buyer.IdentityNumber = "11111111111";
            buyer.LastLoginDate = user.LastLoginDate.ToString("yyyy-MM-dd HH:mm:ss");
            buyer.RegistrationDate = user.RegistrationDate.ToString("yyyy-MM-dd HH:mm:ss");
            buyer.RegistrationAddress = user.Address;
            buyer.Ip = userIp; //85.34.78.112
            buyer.City = user.City.Name;
            buyer.Country = "Turkey";
            buyer.ZipCode = "";
            request.Buyer = buyer;

            //BENIM FATURA BILGILERİM
            Address billingAddress = new Address();
            billingAddress.ContactName = "Esra Sertsu";
            billingAddress.City = "Istanbul";
            billingAddress.Country = "Turkey";
            billingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            billingAddress.ZipCode = "34742";
            request.BillingAddress = billingAddress;

            
            List<BasketItem> basketItems = new List<BasketItem>();
            BasketItem firstBasketItem = new BasketItem();
            firstBasketItem.Id = activity.Id.ToString();
            firstBasketItem.Name = activity.Title;
            firstBasketItem.Category1 = activity.Categories.Select(x => x.Category.Name).FirstOrDefault();
            firstBasketItem.ItemType = BasketItemType.VIRTUAL.ToString();
            firstBasketItem.Price = RemoveTrailingZeros((activity.Price * count).ToString().Split(',')[0]);

            if (!string.IsNullOrEmpty(subMerchantKey))
            {
                var comision = 50 / 100;
                var KDV = 18 / 100;
                var submerchantprice = activity.Price * 50 / 100 + activity.Price * 50 / 100 * 18 / 100;
                firstBasketItem.SubMerchantKey = subMerchantKey;
                firstBasketItem.SubMerchantPrice = RemoveTrailingZeros((submerchantprice * count).ToString().Split(',')[0]);

            }

            basketItems.Add(firstBasketItem);

            request.BasketItems = basketItems;
            
            ThreedsInitialize payment = ThreedsInitialize.Create(request, _options);
            //IyzipayCore.Model.Payment payment = IyzipayCore.Model.Payment.Create(request, _options);

            if (payment.Status == "success" && payment.ConversationId == conversationId)
                return new StartPaymentResult { ContentHtml = payment.HtmlContent, ErrorMessage = "", ErrorCode = "", ErrorGroup="",  };
            else return new StartPaymentResult { ContentHtml = "", ErrorMessage = payment.ErrorMessage, ErrorCode = payment.ErrorCode, ErrorGroup = _options.ApiKey, Request = _options.SecretKey };
        }

     

        public CleanArchitecture.Domain.SubMerchant GetSubMerchantFromIyzico(string subMerchantExternalId)
        {
            var conversaitonId = Guid.NewGuid().ToString();

            RetrieveSubMerchantRequest request = new RetrieveSubMerchantRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = conversaitonId;
            request.SubMerchantExternalId = subMerchantExternalId;

            IyzipayCore.Model.SubMerchant subMerchant = IyzipayCore.Model.SubMerchant.Retrieve(request, _options);

            if (subMerchant.ConversationId == conversaitonId && subMerchant.Status != "failure" && string.IsNullOrEmpty(subMerchant.ErrorMessage))
                return new CleanArchitecture.Domain.SubMerchant()
                {
                    Status = subMerchant.Status == "success" ? true : false,
                    Address = subMerchant.Address,
                    GsmNumber = subMerchant.GsmNumber,
                    ContactName = subMerchant.ContactName,
                    ContactSurname = subMerchant.ContactSurname,
                    MerchantType = GetMerchantType(subMerchant.SubMerchantType),
                    SubMerchantKey = subMerchant.SubMerchantKey,
                    Email = subMerchant.Email,
                    TaxNumber = subMerchant.TaxNumber,
                    TaxOffice = subMerchant.TaxOffice,
                    Iban = subMerchant.Iban,
                    IdentityNumber = subMerchant.IdentityNumber,
                    LegalCompanyTitle = subMerchant.LegalCompanyTitle
                };

            else return new CleanArchitecture.Domain.SubMerchant()
            {
                Status = false
            };
        }

        private MerchantType GetMerchantType(string merchantType)
        {
            Enum.TryParse(typeof(SubMerchantType), merchantType, out var result);
            switch (result)
            {
                case SubMerchantType.PERSONAL:
                    return MerchantType.Personal;
                case SubMerchantType.PRIVATE_COMPANY:
                    return MerchantType.Private;
                case SubMerchantType.LIMITED_OR_JOINT_STOCK_COMPANY:
                    return MerchantType.LimitedOrAnonim;
            }

            throw new RestException(HttpStatusCode.BadRequest, new { MerchantType = "Iyzico submerchant type cant be found" });

        }

        private string RemoveTrailingZeros(string strPrice)
        {
            return strPrice.Contains(".") ? strPrice.TrimEnd('0').TrimEnd('.') : strPrice;
        }


        public RefundDto IyzicoRefund(string paymentTransactionId, string price, string ip)
        {
            var conversationId = new Guid();
            CreateRefundRequest request = new CreateRefundRequest();
            request.ConversationId = conversationId.ToString();
            request.Locale = Locale.TR.ToString();
            request.PaymentTransactionId = paymentTransactionId;
            request.Price = RemoveTrailingZeros(price); 
            request.Ip = ip;
            request.Currency = Currency.TRY.ToString();

            Refund refund = Refund.Create(request, _options);

            if (refund.ConversationId == conversationId.ToString() && refund.Status == Status.SUCCESS.ToString())
            {
                return new RefundDto()
                {
                    Status = refund.Status,
                    PaymentId = refund.PaymentId,
                    PaymentTransactionId = refund.PaymentTransactionId,
                    Price = refund.Price,
                    Currency = refund.Currency,
                };
            }
            else 
                return new RefundDto()
            {
                ErrorCode = refund.ErrorCode,
                ErrorMessage = refund.ErrorMessage,
                ErrorGroup = refund.ErrorGroup,
                Status = refund.Status
            };
        }
    }
}
