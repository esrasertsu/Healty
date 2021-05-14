using AutoMapper;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.Messages
{
    public class MappingChatMessages: Profile
    {
        public MappingChatMessages()
        {
            CreateMap<Message, ChatMessageDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Sender.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Sender.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(
                    x => x.IsMain).Url));

        }
    }
}
