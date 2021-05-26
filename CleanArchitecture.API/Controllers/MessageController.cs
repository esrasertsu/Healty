using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Messages;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    public class MessageController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ChatRoomDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("chat")]
        public async Task<ActionResult<ListMessage.MessagesEnvelope>> ListMessages(int? limit, int? offset, Guid chatRoomId)
        {
            return await Mediator.Send(new ListMessage.Query(limit,offset,chatRoomId));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Update(Guid Id, UpdateMessage.Command command)
        {
            command.Id = Id;
            return await Mediator.Send(command);
        }
    }
}
