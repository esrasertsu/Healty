﻿using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.Comments
{
    public class RevertCommentReport
    {
        public class Command : IRequest
        {
            public Guid CommentId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _context = context;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                if(request.CommentId.GetType() != typeof(Guid) || request.CommentId == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Review = "Not Found" });

                var review = await _context.UserProfileComments.SingleOrDefaultAsync(x => x.Id == request.CommentId);

                if (review == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Review = "Not Found" });

                try
                {
                    if (review.Reported)
                    {
                        review.Reported = false;

                        var success = await _context.SaveChangesAsync() > 0;

                        if (success) return Unit.Value;
                        else throw new Exception("Problem saving changes");
                    }
                    else
                        return Unit.Value;
                }
                catch (Exception)
                {

                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}