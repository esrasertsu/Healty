using AutoMapper;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Categories
{
    public class ListSubCategories
    {
        public class Query : IRequest<List<SubCategoryDto>>
        {
            public Guid CategoryId { get; set; }

        }

        public class Handler : IRequestHandler<Query, List<SubCategoryDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;

            }
            public async Task<List<SubCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                var subCategories = await _context.SubCategories
                                   .Where(x => x.Category.Id == request.CategoryId)
                                   .OrderBy(x => x.Name).ToListAsync();

                return _mapper.Map<List<SubCategory>, List<SubCategoryDto>>(subCategories);


            }
        }
    }
}
