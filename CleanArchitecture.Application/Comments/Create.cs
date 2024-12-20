﻿using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Comments
{
    public class Create
    {
        public class Command : IRequest<ActivityCommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
            
        }

        public class Handler : IRequestHandler<Command, ActivityCommentDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IUserCultureInfo _userCultureInfo;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _userCultureInfo = userCultureInfo;
            }

            public async Task<ActivityCommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
              
                var activity = await _context.Activities.FindAsync(request.ActivityId); 

                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Activity not found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new ActivityComment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = _userCultureInfo.GetUserLocalTime()
                };

                activity.Comments.Add(comment);


                var success = await _context.SaveChangesAsync() > 0;

                if (success) 
                    return _mapper.Map<ActivityCommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}
