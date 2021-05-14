using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public virtual ICollection<UserChatRooms> Users { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastMessageAt { get; set; }

    }
}
