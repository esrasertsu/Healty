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

namespace CleanArchitecture.Application.Location
{
    public class ListCities
    {
        public class Query : IRequest<List<CityDto>> { }

        public class Handler : IRequestHandler<Query, List<CityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;

            }
            public async Task<List<CityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // CultureInfo culture = new CultureInfo("tr-TR");StringComparer.Create(culture, false) //  StringComparer.CurrentCulture

                var cities = await _context.Cities.OrderBy(x => x.Name).ToListAsync(cancellationToken);

                return _mapper.Map<List<City>, List<CityDto>>(cities);

            }
        }
    }
}
