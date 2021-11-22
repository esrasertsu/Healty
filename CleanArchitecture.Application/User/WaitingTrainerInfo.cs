using AutoMapper;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Location;
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
            private readonly IMapper _mapper;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor, IMapper mapper)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _mapper = mapper;
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

                var accessDtoToReturn = new List<AccessibilityDto>();

                foreach (var access in user.UserAccessibilities)
                {
                    var accDto = new AccessibilityDto
                    {
                        Key = access.Accessibility.Id.ToString(),
                        Text = access.Accessibility.Name,
                        Value = access.Accessibility.Id.ToString(),
                    };

                    accessDtoToReturn.Add(accDto);
                }

                var subcatsToReturn = new List<SubCategoryDto>();

                foreach (var cat in user.UserSubCategories)
                {
                    var catDto = new SubCategoryDto
                    {
                        Key = cat.SubCategory.Id.ToString(),
                        Text = cat.SubCategory.Name,
                        Value = cat.SubCategory.Id.ToString(),
                    };

                    subcatsToReturn.Add(catDto);
                }

                return new WaitingTrainerInfoDto()
                {
                    SendToRegister = user.Role == Role.UnderConsiTrainer,
                    SubMerchantKey = user.SubMerchantKey,
                    Categories = catsToReturn,
                    Accessibilities = accessDtoToReturn,
                    SubCategories = subcatsToReturn,
                    UserName = user.UserName,
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Title = user.Title,
                    PhoneNumber = user.PhoneNumber,
                    Description = user.Bio,
                    Experience = user.Experience,
                    ExperienceYear = user.ExperienceYear,
                    Role = user.Role.ToString(),
                    Dependency = user.Dependency,
                    City = _mapper.Map<City, CityDto>(user.City),
                    Certificates = user.Certificates
                };
            }
        }
    
    }
}
