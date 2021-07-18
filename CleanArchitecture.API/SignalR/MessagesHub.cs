using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.User;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CleanArchitecture.API.SignalR
{
    public class MessagesHub : Hub
    {
       
        private readonly IMediator _mediator;

        public MessagesHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendMessage(Create.Command command)
        {
            string username = GetUserName();

            command.Username = username;

            var message = await _mediator.Send(command);
            await Clients.Group(command.ChatRoomId.ToString()).SendAsync("ReceiveMessage", message);

        }

        public async Task SeenMessage(UpdateMessage.Command command)
        {
            var result = await _mediator.Send(command);

            await Clients.Group(command.ChatRoomId.ToString()).SendAsync("MessageSeen", command);

        }

        public async Task SetMessageSeenJustAfterLooked(UpdateMessage.Command command)
        {
            await Clients.Group(command.ChatRoomId.ToString()).SendAsync("MessageSeen", command);
        }

        private string GetUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
        public async Task AddToChat(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserName();

           // await Clients.Group(groupName).SendAsync("Online", username);
        }

        public async Task SetUserOnline()
        {
            var username = GetUserName();
            await Clients.All.SendAsync("Online", username);
        }

        public async Task AddToNewChat(string groupName, string receiver, string senderName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserName();

            await Clients.User(receiver).SendAsync("NewChatRoomAdded", groupName, username, senderName);

           // await Clients.Group(groupName).SendAsync("Online", username);
        }

        public async Task RemoveFromChat(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        }


        public async Task SetUserOffline()
        {
            var username = GetUserName();
            await Clients.All.SendAsync("Offline", username);
        }
    }
}
