using AutoMapper;
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

namespace CleanArchitecture.Application.UserProfileComments
{
    public class Create
    {
        public class Command : IRequest<UserProfileCommentDto>
        {
            public string Body { get; set; }
            public string Username { get; set; }
            public int StarCount { get; set; }
            public bool AllowDisplayName { get; set; }

        }

        public class Handler : IRequestHandler<Command, UserProfileCommentDto>
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

            public async Task<UserProfileCommentDto> Handle(Command request, CancellationToken cancellationToken)
            {

                var trainer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (trainer == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Trainer = "Trainer not found" });

                var author = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (author == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

                var comment = new UserProfileComment
                {
                    Author = author,
                    Target = trainer,
                    StarCount = request.StarCount,
                    AllowDisplayName = request.AllowDisplayName,
                    Body = request.Body,
                    CreatedAt = DateTime.Now,
                    Status = false
                };

                var existingComment = await _context.UserProfileComments.SingleOrDefaultAsync(x => x.AuthorId == author.Id && x.TargetId == trainer.Id);

                if (existingComment != null)
                {

                    _context.UserProfileComments.Remove(existingComment);
                }


                _context.UserProfileComments.Add(comment);
//                trainer.ReceivedComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                   return _mapper.Map<UserProfileCommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}
