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
    public class ListMessage
    {
        public class MessagesEnvelope
        {
            public List<ChatMessageDto> Messages { get; set; }
            public int MessageCount { get; set; }

        }

        public class Query : IRequest<MessagesEnvelope> 
        {
            public Query(int? limit, int? offset, Guid chatRoomId)
            {
                Limit = limit;
                Offset = offset;
                ChatRoomId = chatRoomId;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public Guid ChatRoomId { get; set; }
        }


        public class Handler : IRequestHandler<Query, MessagesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IChatRoomReader _chatRoomReader;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IChatRoomReader chatRoomReader, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _chatRoomReader = chatRoomReader;
                _mapper = mapper;

        }
        public async Task<MessagesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                var chatRoom = await _context.ChatRooms.SingleOrDefaultAsync(x => x.Id == request.ChatRoomId);

                if(chatRoom == null)
                    throw new RestException(HttpStatusCode.NotFound, new { ChatRoom = "NotFound" });

                if(chatRoom.Users.Any(x => x.AppUserId == currentUser.Id))
                {
                    var unreadmessages = chatRoom.Messages.Where(x => x.Seen == false && x.Sender.Id != currentUser.Id).ToList();

                    if(unreadmessages.Count>0)
                    {
                        foreach (var item in unreadmessages)
                        {
                            var message = await _context.Messages.FindAsync(item.Id);
                            message.Seen = true;
                        }

                        var success = await _context.SaveChangesAsync() > 0;
                    }

                    var allmessages = chatRoom.Messages.OrderByDescending(x => x.CreatedAt).ToList();

                    var messages = allmessages
                       .Skip(request.Offset ?? 0)
                       .Take(request.Limit ?? 20).ToList();

                    return new MessagesEnvelope
                    {
                        Messages = _mapper.Map<List<Message>, List<ChatMessageDto>>(messages),
                        MessageCount = allmessages.Count()
                    };
                }

                throw new RestException(HttpStatusCode.BadRequest, new { User = "Not Permitted" });


            }
        }
    }
}
