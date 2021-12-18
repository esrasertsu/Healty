using CleanArchitecture.Application.Profiles;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin
{
    public class TrainerDetails
    {
        public class Query : IRequest<Trainer>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Trainer>
        {
            private readonly IProfileReader _profileReader;

            public Handler(IProfileReader profileReader)
            {
                _profileReader = profileReader;
            }

            public async Task<Trainer> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _profileReader.ReadTrainerInfo(request.UserName);
            }
        }
    }
}
