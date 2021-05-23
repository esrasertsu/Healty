using CleanArchitecture.Application.Messages;
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

        private string GetUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
        public async Task AddToChat(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserName();

            await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
        }

        public async Task RemoveFromChat(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserName();

            await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
        }
    }
}
