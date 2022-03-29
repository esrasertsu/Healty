using AutoMapper;
using CleanArchitecture.Application.Errors;
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

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class CreateCommissionStat
    {
        public class Command : IRequest<CommissionStatusDto>
        {
            public string Name { get; set; }
            public string Rate { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Rate).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, CommissionStatusDto>
        {
            private readonly DataContext _context;
            // private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommissionStatusDto> Handle(Command request, CancellationToken cancellationToken)
            {

                var status = new CommissionStatus
                {
                    Name = request.Name,
                    Rate = Convert.ToDecimal(request.Rate)
                };

                _context.CommissionStatuses.Add(status); //addsync is just for special creators

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommissionStatus, CommissionStatusDto>(status);
                throw new Exception("Problem saving changes");
            }
        }
    }
}