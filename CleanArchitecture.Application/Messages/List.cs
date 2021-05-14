using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Messages
{
    public class List
    {
        public class Query : IRequest<List<ChatRoomDto>>{}


        public class Handler : IRequestHandler<Query, List<ChatRoomDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IChatRoomReader _chatRoomReader;

            public Handler(DataContext context,IUserAccessor userAccessor, IChatRoomReader chatRoomReader)
            {
                _context = context;
                _userAccessor = userAccessor;
                _chatRoomReader = chatRoomReader;
            }
            public async Task<List<ChatRoomDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                var queryable = _context.ChatRooms.AsQueryable();

                var chatRooms = await queryable
                    .Where(x => x.Users.Any(y=> y.AppUserId == currentUser.Id))
                    .OrderByDescending(x => x.LastMessageAt)
                    .ToListAsync();

                var chatRoomDtos = new List<ChatRoomDto>();

                foreach (var room in chatRooms)
                {
                    chatRoomDtos.Add(await _chatRoomReader.ReadChatRoom(room.Id));
                }
                return chatRoomDtos;

            }
        }
    }
}
