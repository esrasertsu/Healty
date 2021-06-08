using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, ActivityDto>
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

            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _activityReader.ReadActivity(request.Id);
            }
        }
    }
}
