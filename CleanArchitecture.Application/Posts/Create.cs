using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Posts
{
    public class Create
    {
        public class Command : IRequest<PostDto>
            {
                public string Title { get; set; }
                public string Description { get; set; }
                public string Category { get; set; }

           }
        public class Handler : IRequestHandler<Command, PostDto>
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

                public async Task<PostDto> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    var post = new Domain.Post
                    {
                        Title = request.Title,
                        Description = request.Description,
                        Date = DateTime.Now,
                        Category = request.Category,
                        Author = user
                    };

                    _context.Posts.Add(post); //addsync is just for special creators

                    var success = await _context.SaveChangesAsync() > 0;


                if (success)
                    return _mapper.Map<PostDto>(post);

                throw new Exception("Problem saving changes");
                }
        }
    }
}
