using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public virtual Order Order { get; set; }
        public string PaymentTransactionId { get; set; }
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }

        public decimal Price { get; set; }        //kullanıcı fiyatı product tablosundan alıp zamdan etkilenmemesi için ayrıca ilk price'ı tutuyoruz
        public int Quantity { get; set; }
        public EnumOrderItemApproveState AdminPaymentApproved { get; set; }
        public DateTime? AdminPaymentApprovedDate { get; set; }
        public DateTime? AdminPaymentDisapprovedDate { get; set; }

    }


    public enum EnumOrderItemApproveState
    {
        Waiting = 0,
        Approved = 1,
        Disapproved = 2
    }
}
