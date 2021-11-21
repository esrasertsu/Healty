using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class WaitingTrainerInfo
    {
        public class Query : IRequest<WaitingTrainerInfoDto>
        {

        }

        public class Handler : IRequestHandler<Query, WaitingTrainerInfoDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<WaitingTrainerInfoDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                if (user == null) throw new RestException(HttpStatusCode.Unauthorized);
                if (user.Role != Role.WaitingTrainer && user.Role != Role.Admin) throw new RestException(HttpStatusCode.Forbidden);


                var catsToReturn = new List<CategoryDto>();

                foreach (var cat in user.UserCategories)
                {
                    var catDto = new CategoryDto
                    {
                        Key = cat.Category.Id.ToString(),
                        Text = cat.Category.Name,
                        Value = cat.Category.Id.ToString(),
                    };

                    catsToReturn.Add(catDto);
                }

                return new WaitingTrainerInfoDto()
                {
                    Categories = catsToReturn,
                    Displayname= user.DisplayName,
                    Username= user.UserName
                };
            }
        }
    
    }
}
