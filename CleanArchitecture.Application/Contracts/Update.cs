using AutoMapper;
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

namespace CleanArchitecture.Application.Contracts
{
    public class Update
    {
        public class Command : IRequest<ContractDto>
        {
            public Guid Id { get; set; }
            public string Content { get; set; }
            public bool? Status { get; set; }
        }

        public class Handler : IRequestHandler<Command, ContractDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IUserCultureInfo _userCultureInfo;
            private readonly IMapper _mapper;

            public Handler(DataContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IMapper mapper, IUserCultureInfo userCultureInfo)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userCultureInfo = userCultureInfo;
                _mapper = mapper;

            }

            public async Task<ContractDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var contract = await _context.Contracts.SingleOrDefaultAsync(x => x.Id == request.Id);

                if (contract == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Contract = "Not Found" });

                try
                {
                    if(request.Status != null)
                        contract.Status = request.Status.Value;
                    
                    if(!string.IsNullOrEmpty(request.Content))
                        contract.Content = request.Content;

                    contract.LastUpdateDate = _userCultureInfo.GetUserLocalTime();

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return _mapper.Map<Contract, ContractDto>(contract);

                    throw new Exception("Problem saving changes");

                }
                catch (Exception)
                {

                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}
