using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class SendSms
    {
        public class Query : IRequest<bool>
        {
            public string PhoneNumber { get; set; }

        }

        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly ISmsSender _smsSender;

            public Handler(DataContext context, ISmsSender smsSender)
            {
                _context = context;
                _smsSender = smsSender;

            }
            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var phone = request.PhoneNumber.Trim();
                if (!phone.StartsWith("+"))
                    phone = "+" + phone;

                return await _smsSender.SendSmsAsync(phone);

            }
        }
    }
}
