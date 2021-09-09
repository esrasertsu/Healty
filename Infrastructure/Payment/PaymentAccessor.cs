using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using IyzipayCore;
using IyzipayCore.Model;
using IyzipayCore.Request;
using CleanArchitecture.Domain;

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

        public string GetActivityPaymentPageFromIyzico(Activity activity, AppUser user, int count)
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
            buyer.Name = user.DisplayName;
            buyer.Surname = user.UserName;
            //buyer.GsmNumber = user.PhoneNumber;
            buyer.Email = user.Email;
            buyer.IdentityNumber = "74300864791";
            buyer.RegistrationAddress = "Güzelyalı 60 sok. No:41 Daire:11";//user.Address;
            buyer.Ip = "85.34.78.112";
            buyer.City = user.City.Name;
            buyer.Country = "Turkey";
            request.Buyer = buyer;

            //Address shippingAddress = new Address();
            //request.ShippingAddress = shippingAddress;


            //BENIM FATURA BILGILERİM
            Address billingAddress = new Address();
            billingAddress.ContactName = "Jane Doe";
            billingAddress.City = "Istanbul";
            billingAddress.Country = "Turkey";
            billingAddress.Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
            billingAddress.ZipCode = "34742";
            request.BillingAddress = billingAddress;

            List<BasketItem> basketItems = new List<BasketItem>();
            BasketItem firstBasketItem = new BasketItem();
            firstBasketItem.Id = activity.Id.ToString();
            firstBasketItem.Name = activity.Title;
            firstBasketItem.Category1 = "Activite";
            firstBasketItem.ItemType = BasketItemType.VIRTUAL.ToString();
            firstBasketItem.Price = (activity.Price * count).ToString().Split(',')[0];
            firstBasketItem.SubMerchantKey = "G2FCFycIof0paTP6687dOoch9Tc=";
            firstBasketItem.SubMerchantPrice = (activity.Price * 80 /100 * count).ToString().Split(',')[0];
            basketItems.Add(firstBasketItem);

            request.BasketItems = basketItems;

            CheckoutFormInitialize checkoutFormInitialize = CheckoutFormInitialize.Create(request, _options);

            return checkoutFormInitialize.CheckoutFormContent;
        }
    }
}
