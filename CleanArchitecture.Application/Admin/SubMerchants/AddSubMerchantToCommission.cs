using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class AddSubMerchantToCommission
    {

        public class Command : IRequest<ICollection<SubMerchantInfo>>
        {
            public List<string> TrainerIds { get; set; }
            public Guid CommissionId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.TrainerIds).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, ICollection<SubMerchantInfo>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<ICollection<SubMerchantInfo>> Handle(Command request, CancellationToken cancellationToken)
            {

                var stat = await _context.CommissionStatuses.SingleOrDefaultAsync(x => x.Id == request.CommissionId);

                if (stat == null)
                    throw new RestException(HttpStatusCode.NotFound, new { stat = "Not Found" });

                try
                {
                    if (request.TrainerIds != null)
                    {
                        foreach (var item in request.TrainerIds)
                        {
                            var user = await _context.SubMerchants.SingleOrDefaultAsync(x => x.UserId == item);

                            if (user == null)
                                throw new RestException(HttpStatusCode.NotFound, new { SubMerchant = "Not found" });
                            else
                            {
                                if (stat.SubMerchants == null) stat.SubMerchants = new List<SubMerchant>();

                                stat.SubMerchants.Add(user);
                            }
                        }
                        var result = await _context.SaveChangesAsync() > 0;
                        

                        if (result) return _mapper.Map<ICollection<SubMerchant>, ICollection<SubMerchantInfo>>(stat.SubMerchants);
                        else throw new Exception("Problem saving changes");
                    }
                    else
                    {
                         throw new Exception("Problem saving changes");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception("Problem saving changes:" + e.Message);
                }

            }
        }
     }
}
