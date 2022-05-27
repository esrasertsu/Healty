using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities.Administration
{
    public class UpdateActivityStatus
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Status { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserCultureInfo _userCultureInfo;
            public Handler(DataContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
                _userCultureInfo = userCultureInfo;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "Not Found" });

                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not Found" });

                Enum.TryParse(typeof(ActivityStatus), request.Status, out var status);
                if (status == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Role = "Not found" });
                }


                try
                {
                    if (activity.Status != (ActivityStatus)status)
                    {

                        activity.Status = (ActivityStatus)status;
                        activity.LastUpdateDate = _userCultureInfo.GetUserLocalTime();

                        if ((ActivityStatus)status == ActivityStatus.TrainerCompleteApproved)
                            activity.TrainerApprovedDate =  _userCultureInfo.GetUserLocalTime();

                        if ((ActivityStatus)status == ActivityStatus.AdminPaymentDisapproved && (ActivityStatus)status == ActivityStatus.AdminPaymentApproved && user.Role == Role.Admin)
                            activity.AdminApprovedDate = _userCultureInfo.GetUserLocalTime();

                        var result = await _context.SaveChangesAsync() > 0;
                        if (result)
                            return Unit.Value;

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
