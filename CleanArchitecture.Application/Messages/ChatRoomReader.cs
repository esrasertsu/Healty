using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Messages
{
    public class ChatRoomReader : IChatRoomReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public ChatRoomReader(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<ChatRoomDto> ReadChatRoom(Guid chatRoomId)
        {
            var queryable = _context.ChatRooms.AsQueryable();

            var chatRoom = await queryable.SingleOrDefaultAsync(x => x.Id == chatRoomId);

            if (chatRoom == null)
                throw new RestException(HttpStatusCode.NotFound, new { Room = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var user = chatRoom.Users.FirstOrDefault(x => x.AppUserId != currentUser.Id);

            var chatRoomDto = new ChatRoomDto
            {
                Id = chatRoomId,
                UserName = user.AppUser.UserName,
                UserImage = user.AppUser.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                LastMessage = chatRoom.Messages.LastOrDefault().Body,
                LastMessageDate = chatRoom.LastMessageAt
            };

            return chatRoomDto;
        }
    }
    }
