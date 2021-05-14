using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Messages
{
    public class ChatRoomDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string UserImage { get; set; }
        public DateTime LastMessageDate { get; set; }
        public string LastMessage { get; set; }
    }
}
