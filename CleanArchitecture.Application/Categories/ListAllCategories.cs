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
    public class ListAllCategories
    {
        public class Query : IRequest<List<CategoryListDto>> { }

        public class Handler : IRequestHandler<Query, List<CategoryListDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;

            }
            public async Task<List<CategoryListDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<CategoryListDto> categories = new List<CategoryListDto>();
                var cat = await _context.Categories.ToListAsync(cancellationToken);
                var sub = await _context.SubCategories.ToListAsync(cancellationToken);

                foreach (var item in cat)
                {
                    categories.Add(new CategoryListDto
                    {
                        Key = item.Id.ToString(),
                        Value = item.Id.ToString(),
                        Text = item.Name.ToString(),
                        ChildNames = item.SubCategories.Select(x => x.Name).ToList(),
                        ChildIds = item.SubCategories.Select(x => x.Id.ToString()).ToList(),
                        BlogCount = item.Blogs.Count
                    }) ;
                }

                foreach (var item in sub)
                {
                    categories.Add(new CategoryListDto
                    {
                        Key = item.Id.ToString(),
                        Value= item.Id.ToString(),
                        Text = item.Name.ToString(),
                        ParentName = item.Category.Name,
                        ParentId = item.Category.Id.ToString(),
                        BlogCount = item.Blogs.Count
                    }) ;
                }

                return categories;

            }
        }
    }
}
