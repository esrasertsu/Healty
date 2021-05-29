using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
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

namespace CleanArchitecture.Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
            public string Experience { get; set; }
            public string ExperienceYear { get; set; }
            public string Certificates { get; set; }
            public string Dependency { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public List<Guid> SubCategoryIds { get; set; }
            public List<Guid> Accessibilities { get; set; }

            //public class CommandValidator : AbstractValidator<Command>
            //{
            //    public CommandValidator()
            //    {
            //        RuleFor(x => x.DisplayName).NotEmpty();
            //        RuleFor(x => x.CategoryIds).NotEmpty();
            //        RuleFor(x => x.Accessibilities).NotEmpty();
            //        RuleFor(x => x.SubCategoryIds).NotEmpty();
            //    }
            //}

            public class Handler : IRequestHandler<Command>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;


                public Handler(DataContext context, IUserAccessor userAccessor)
                {
                    _context = context;
                    _userAccessor = userAccessor;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                    user.DisplayName = request.DisplayName ?? user.DisplayName;
                    user.Dependency = request.Dependency ?? user.Dependency;
                    user.Certificates = request.Certificates ?? user.Certificates;
                    user.Bio = request.Bio ?? user.Bio;
                    user.Experience = request.Experience ?? user.Experience;
                    user.ExperienceYear = Convert.ToDecimal(request.ExperienceYear) > 0 ? Convert.ToDecimal(request.ExperienceYear) : user.ExperienceYear;
                    

                    if (request.CategoryIds != null)
                        foreach (var catId in request.CategoryIds)
                        {
                            var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                            if (cat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                            else
                            {
                                user.Categories.Add(cat);
                            }
                        }


                    if (request.SubCategoryIds != null)
                        foreach (var subCatId in request.SubCategoryIds)
                        {
                            var subCat = await _context.SubCategories.SingleOrDefaultAsync(x => x.Id == subCatId);

                            if (subCat == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                            else
                            {
                                user.SubCategories.Add(subCat);
                            }
                        }

                    if (request.Accessibilities != null)
                        foreach (var accId in request.Accessibilities)
                        {
                            var acc = await _context.Accessibilities.SingleOrDefaultAsync(x => x.Id == accId);

                            if (acc == null)
                                throw new RestException(HttpStatusCode.NotFound, new { Accessibility = "NotFound" });
                            else
                            {
                                user.Accessibilities.Add(acc);
                            }
                        }


                    var success = await _context.SaveChangesAsync() > 0;


                    if (success)
                        return Unit.Value;

                    throw new Exception("Problem saving changes");
                }
            }
        }
    }
}
