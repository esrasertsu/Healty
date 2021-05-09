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

namespace CleanArchitecture.Application.Categories
{
    public class CreateSubCategory
    {
        public class Command : IRequest
        {
            public string Name { get; set; }
            public Guid CategoryId { get; set; }
     
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.CategoryId).NotEmpty();
                RuleFor(x => x.Name).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
           // private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == request.CategoryId);
                if (category == null)
                    throw new RestException(HttpStatusCode.NotFound, new { category = "Not Found" });

                var subCat = new SubCategory
                {
                    Name = request.Name,
                    Category = category
                };

                _context.SubCategories.Add(subCat); //addsync is just for special creators

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}
