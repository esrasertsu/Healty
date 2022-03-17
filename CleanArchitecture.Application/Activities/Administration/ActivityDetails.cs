using AutoMapper;
using CleanArchitecture.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities.Administration
{
    public class ActivityDetails
    {
        public class Query : IRequest<AdminActivityDto>
        {
            public Guid ActivityId { get; set; }
        }
        public class Handler : IRequestHandler<Query, AdminActivityDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IActivityReader _activityReader;


            public Handler(DataContext context, IMapper mapper, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _activityReader = activityReader;


            }

            public async Task<AdminActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _activityReader.ReadAdminActivity(request.ActivityId);
            }
        }
        
    }
}
