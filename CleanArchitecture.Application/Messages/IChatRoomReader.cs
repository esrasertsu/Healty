using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Messages
{
    public interface IChatRoomReader
    {
        Task<ChatRoomDto> ReadChatRoom(Guid chatRoomId);
    }
}
