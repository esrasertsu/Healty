using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Persistence;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class SendSmsVerification
    {
        public class Query : IRequest<bool>
        {
            public string PhoneNumber { get; set; }
            public string Code { get; set; }

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

                var code = request.Code.Trim();

               var smsResponse=  await _smsSender.VerifySmsAsync(phone, code);

                return smsResponse;

            }
        }
    }
}
