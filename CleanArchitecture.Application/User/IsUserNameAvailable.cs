using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class IsUserNameAvailable
    {
        public class Query : IRequest<bool>
        {
            public string UserName { get; set; }
            public string Email { get; set; }

        }

        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
         

            public Handler(DataContext context)
            {
                _context = context;
             
            }
            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Bu email başka bir hesapla ilişkili." });

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Bu kullanıcı adı başka bir hesapla ilişkili." });

                return true;

            }
        }
    }
}
