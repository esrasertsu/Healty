using AutoMapper;
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

namespace CleanArchitecture.Application.Activities.Administration
{
    public class ListAllActivities
    {
        public class AllActivitiesEnvelope
        {
            public List<AdminActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }

        }
        public class Query : IRequest<AllActivitiesEnvelope>
        {

            public Query(int? limit, int? offset, string userName, string status)
            {
                Limit = limit;
                Offset = offset;
                UserName = userName;
                Status = status;


            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string UserName { get; set; }
            public string Status { get; set; }



        }

        public class Handler : IRequestHandler<Query, AllActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IActivityReader _activityReader;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _activityReader = activityReader;
            }
            public async Task<AllActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user.UserName != request.UserName && user.Role != Role.Admin)
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { User = "Not Found" });
                }

                var queryable = _context.Activities.OrderByDescending(x => x.Date).AsQueryable();

                if(!string.IsNullOrEmpty(request.UserName))
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(
                        a => a.AppUser.UserName == request.UserName && a.IsHost
                    ));
                }
                if (request.Status == ActivityStatus.UnderReview.ToString())
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.UnderReview);
                }
                else if (request.Status == ActivityStatus.Active.ToString())//onayımı bekleyenler
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.Active); // tarihi geçen koşulunu ekle
                }
                else if (request.Status == ActivityStatus.TrainerCompleteApproved.ToString())
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.TrainerCompleteApproved);
                }
                else if (request.Status == ActivityStatus.AdminPaymentApproved.ToString())
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.AdminPaymentApproved);
                }
                else if (request.Status == ActivityStatus.CancelRequested.ToString())
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.CancelRequested);
                }
                else if (request.Status == ActivityStatus.PassiveByAdmin.ToString())
                {
                    queryable = queryable.Where(x => x.Status == ActivityStatus.PassiveByAdmin);
                }


                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();


                var acts = new List<AdminActivityDto>();
                foreach (var act in activities)
                {
                    acts.Add(await _activityReader.ReadAdminActivity(act.Id));
                }


                return new AllActivitiesEnvelope
                {
                    Activities = acts,
                    ActivityCount = queryable.Count()
                };

            }
        }
    }
}
