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
        public EnumPaymentTypes PaymentType { get; set; }
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public string PaymentId { get; set; }
        public string PaymentToken { get; set; }
        public string ConversationId { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

    }


    public enum EnumOrderState
    {
        Waiting = 0,
        Unpaid = 1,
        Completed =2
    }

    public enum EnumPaymentTypes
    {
        Creditcard = 0,
        Eft = 1
    }
}
