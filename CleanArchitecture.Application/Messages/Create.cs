using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
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
    public class Create
    {
        public class Command : IRequest<ChatMessageDto>
        {
            public string Body { get; set; }
            public Guid ChatRoomId { get; set; }
            public string Username { get; set; }

        }

        public class Handler : IRequestHandler<Command, ChatMessageDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<ChatMessageDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Login = "User Not Found" });

                var chatRoom = await _context.ChatRooms.FindAsync(request.ChatRoomId);

                if (chatRoom == null)
                    throw new RestException(HttpStatusCode.NotFound, new { ChatRoom = "Chat not found" });


                if (chatRoom.Users.Any(x => x.AppUserId == currentUser.Id))
                {
                    var message = new Message
                    {
                        Sender = currentUser,
                        ChatRoom = chatRoom,
                        Body = request.Body,
                        CreatedAt = DateTime.Now,
                        Seen = false
                    };

                    chatRoom.Messages.Add(message);
                    chatRoom.LastMessageAt = DateTime.Now;

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success)
                        return _mapper.Map<ChatMessageDto>(message);

                    throw new Exception("Problem saving changes");
                }
                else
                throw new RestException(HttpStatusCode.NotFound, new { User = "Permission denied" });
               
            }
        }
    }
}
