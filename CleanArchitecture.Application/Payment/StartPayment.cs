using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Payment
{
    public class StartPayment
    {
        public class Query : IRequest<bool>
        {
            public string CardNumber { get; set; }
            public string CardHolderName { get; set; }
            public string CVC { get; set; }
            public string ExpireDate { get; set; }
            public bool HasSignedPaymentContract { get; set; }
            public bool HasSignedIyzicoContract { get; set; }
            public Guid ActivityId { get; set; }
            public int TicketCount { get; set; }
        }

        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPaymentAccessor _paymentAccessor;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IPaymentAccessor paymentAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _paymentAccessor = paymentAccessor;
                _userAccessor = userAccessor;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound,
                        new { Activity = "Couldn't find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });


                //order yarat statüsü notpaid olan
                //ödemeyi başlat
                //sonucu ekrana dön ve order statüsü güncelle
                //eğer sonuç başarılı ise kullanıcı attend et

                return true;
                throw new Exception("Problem saving user data");



            }
        }
    }
}
