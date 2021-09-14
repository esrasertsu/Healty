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

        public string GetActivityPaymentPageFromIyzico(Activity activity, AppUser user, int count, IPAddress userIp)
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
            buyer.Ip = userIp.ToString();//"85.34.78.112";
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
    
        public string PaymentProcessWithIyzico(Activity activity, AppUser user, int count, IPAddress userIp)
        {

            CreatePaymentRequest request = new CreatePaymentRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = "123456789";
            request.Price = "1";
            request.PaidPrice = "1.2";
            request.Currency = Currency.TRY.ToString();
            request.Installment = 1;
            request.BasketId = "B67832";
            request.PaymentChannel = PaymentChannel.WEB.ToString();
            request.PaymentGroup = PaymentGroup.LISTING.ToString();

            PaymentCard paymentCard = new PaymentCard();
            paymentCard.CardHolderName = "John Doe";
            paymentCard.CardNumber = "5528790000000008";
            paymentCard.ExpireMonth = "12";
            paymentCard.ExpireYear = "2020";
            paymentCard.Cvc = "123";
            paymentCard.RegisterCard = 0;
            request.PaymentCard = paymentCard;

            Buyer buyer = new Buyer();
            buyer.Id = "BY789";
            buyer.Name = "John";
            buyer.Surname = "Doe";
            buyer.GsmNumber = "+905350000000";
            buyer.Email = "email@email.com";
            buyer.IdentityNumber = "74300864791";
            buyer.LastLoginDate = "2015-10-05 12:43:35";
            buyer.RegistrationDate = "2013-04-21 15:12:09";
            buyer.RegistrationAddress = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            buyer.Ip = "85.34.78.112";
            buyer.City = "Istanbul";
            buyer.Country = "Turkey";
            buyer.ZipCode = "34732";
            request.Buyer = buyer;

            Address billingAddress = new Address();
            billingAddress.ContactName = "Jane Doe";
            billingAddress.City = "Istanbul";
            billingAddress.Country = "Turkey";
            billingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            billingAddress.ZipCode = "34742";
            request.BillingAddress = billingAddress;

            List<BasketItem> basketItems = new List<BasketItem>();
            BasketItem firstBasketItem = new BasketItem();
            firstBasketItem.Id = "BI101";
            firstBasketItem.Name = "Binocular";
            firstBasketItem.Category1 = "Collectibles";
            firstBasketItem.Category2 = "Accessories";
            firstBasketItem.ItemType = BasketItemType.VIRTUAL.ToString();
            firstBasketItem.Price = "0.3";
            firstBasketItem.SubMerchantKey = "sub merchant key";
            firstBasketItem.SubMerchantPrice = "0.27";
            basketItems.Add(firstBasketItem);

          

            IyzipayCore.Model.Payment payment = IyzipayCore.Model.Payment.Create(request, _options);


            return "";
        }


    }
}
