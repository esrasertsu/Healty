using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Orders
{
    public class OrderDto
    {
        public string Id { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Photo { get; set; }
        public string OrderStatus { get; set; }
        public string OrderNo { get; set; }
        public string Description { get; set; }
        public string ProductId { get; set; }
        public decimal? Price { get; set; }
        public string PaidPrice { get; set; }
        public string PaymentInfo { get; set; }
        public string BuyerName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AttendeeName { get; set; }
        public string TrainerId { get; set; }
        public string TrainerImage { get; set; }
        public int Count { get; set; }
        public string CardLastFourDigit { get; set; }
        public string CardType { get; set; }
        public string CardFamily { get; set; }
        public DateTime ActivityDate { get; set; }
        public bool ActivityOnline { get; set; }
        public string CardAssociation { get; set; }
        public List<string> ActivityLevel { get; set; }
        public List<string> ActivityCategories { get; set; }
        public string PaymentTransactionId { get; set; }

    }
}
