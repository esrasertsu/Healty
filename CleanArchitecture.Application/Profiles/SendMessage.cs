using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Messages;
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

namespace CleanArchitecture.Application.Profiles
{
    public class SendMessage
    {
        public class Command : IRequest<ChatMessageDto>
        {
            public string Body { get; set; }
            public string Receiver { get; set; }

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

                var receiver = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Receiver);

                if (receiver == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Trainer = "Trainer not found" });

                var author = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (author == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });
                
                var queryable = _context.UserChatRooms.AsQueryable();

                var chatRooms = queryable.Where(x => x.AppUserId == author.Id);

                var existingChatRoomWithReceiver = queryable
                         .Where(x => chatRooms.Any(y => y.ChatRoomId == x.ChatRoomId) && x.AppUserId == receiver.Id);

                if (existingChatRoomWithReceiver.Count() == 0)
                {

                    var messages = new List<Message>();

                    ChatRoom newchatRoom = new ChatRoom
                    {
                        Id = new Guid(),
                        CreatedAt = DateTime.Now,
                        Messages = messages,
                        LastMessageAt = DateTime.Now,
                        StarterId = author.Id
                    };

                    Message message = new Message
                    {
                        Id = new Guid(),
                        Sender = author,
                        Body = request.Body,
                        CreatedAt = DateTime.Now,
                        SenderId = author.Id,
                        Seen = false
                    };
                    newchatRoom.Messages.Add(message);
                    _context.ChatRooms.Add(newchatRoom);

                    UserChatRooms userChatRoom = new UserChatRooms
                    {
                        ChatRoom = newchatRoom,
                        AppUser = author,
                        DateJoined = DateTime.Now
                    };
                    _context.UserChatRooms.Add(userChatRoom);

                    UserChatRooms receiverChatRoom = new UserChatRooms
                    {
                        ChatRoom = newchatRoom,
                        AppUser = receiver,
                        DateJoined = DateTime.Now
                    };
                    _context.UserChatRooms.Add(receiverChatRoom);

                    var success = await _context.SaveChangesAsync() > 0;
                    if (success) return _mapper.Map<ChatMessageDto>(message);
                    throw new Exception("Problem saving changes");


                }
                else throw new Exception("You've already started a chat with this person");




            }
        }
    }
}
