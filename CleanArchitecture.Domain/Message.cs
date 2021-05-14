using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public string SenderId { get; set; }
        public virtual AppUser Sender { get; set; }
        public Guid ChatRoomId { get; set; }
        public virtual ChatRoom ChatRoom { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
