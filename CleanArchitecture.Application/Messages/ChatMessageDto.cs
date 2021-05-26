using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Messages
{
    public class ChatMessageDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public bool Seen { get; set; }
        public Guid ChatRoomId { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
    }
}
