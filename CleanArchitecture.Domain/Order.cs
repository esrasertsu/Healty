using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Order
    {
        public Order()
        {
            OrderItems = new Collection<OrderItem>();
        }
        public Guid Id { get; set; }
        public long OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public EnumOrderState OrderState { get; set; }
        public string PaymentType { get; set; }
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public string PaymentId { get; set; }
        public string PaymentToken { get; set; }
        public string ConversationId { get; set; }
        public string BuyerName { get; set; }
        public string CardLastFourDigit { get; set; }
        public string CardFamily { get; set; }
        public string CardAssociation { get; set; }
        public string PaidPrice { get; set; }
        public string Currency { get; set; }
        public string ContractId { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }

    }


    public enum EnumOrderState
    {
        Waiting = 0,
        Unpaid = 1,
        Completed =2,
        Cancelled =3,
        Failed = 4,
        FailedServer = 5,
        Deleted = 6
    }

    public enum EnumPaymentTypes
    {
        Creditcard = 0,
        Eft = 1
    }
}
