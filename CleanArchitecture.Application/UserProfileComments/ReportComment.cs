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

namespace CleanArchitecture.Application.UserProfileComments
{
    public class ReportComment
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Body { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "User not found" });

                var comment = await _context.UserProfileComments.FindAsync(request.Id);

                if (comment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { comment = "Not Found" });


                if(!comment.Reports.Any(x => x.ReportedBy == user.UserName))
                {
                    comment.Reported = true;

                    ProfileCommentReports commentReport = new ProfileCommentReports();
                    commentReport.Body  = request.Body;
                    commentReport.UserProfileCommentId = comment.Id;
                    commentReport.CreatedAt = DateTime.Now;
                    commentReport.ReportedBy = user.UserName;

                    comment.Reports.Add(commentReport);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success)
                        return Unit.Value;
                    throw new Exception("Problem saving changes");


                }
                return Unit.Value;


            }
        }
    }
}
