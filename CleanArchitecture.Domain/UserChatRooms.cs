using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class UserChatRooms
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid ChatRoomId { get; set; }
        public virtual ChatRoom ChatRoom { get; set; }
        public DateTime DateJoined { get; set; }
    }
}
