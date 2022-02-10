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
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class ListSavedActivities
    {

        public class Query : IRequest<List<ActivityDto>>
        {

            public Query(
              //  int? limit, int? offset
                )
            {
               //Limit = limit;
               // Offset = offset; 
            }
            //public int? Limit { get; set; }
            //public int? Offset { get; set; }
          

        }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
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
            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                var activities = _context.UserSavedActivities
                    .Where(x => x.AppUser == user)
                    .OrderBy(x => x.Activity.Date)
                    .ToList();

              
                //var activities = await queryable
                //    .Skip(request.Offset ?? 0)
                //    .Take(request.Limit ?? 10).ToListAsync();


                var acts = new List<ActivityDto>();
                foreach (var act in activities)
                {
                    acts.Add(await _activityReader.ReadActivity(act.ActivityId));
                }


                return acts;

            }
        }
    }
}
