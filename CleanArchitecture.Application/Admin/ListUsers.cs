using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace CleanArchitecture.Application.Admin
{
    public class ListUsers
    {
        public class UsersEnvelope
        {
            public List<NormalUser> UserList { get; set; }
            public int UserCount { get; set; }

        }

        public class Query : IRequest<UsersEnvelope>
        {
            public Query(int? limit, int? offset,string role, string sort)
            {
                Limit = limit;
                Offset = offset;
                Sort = sort;
                Role = role;

            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string Role { get; set; }
            public string Sort { get; set; }
        }


        public class Handler : IRequestHandler<Query, UsersEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IProfileReader _profileReader;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IProfileReader profileReader, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _profileReader = profileReader;
                _userAccessor = userAccessor;
            }
            public async Task<UsersEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                          x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryableUsers = _context.Users
                    .AsQueryable();

                queryableUsers = queryableUsers.Where(x => x.Role == Role.User || x.Role == Role.SuspendUser || x.Role == Role.FreezeUser);

                #region Filters
                if (!string.IsNullOrEmpty(request.Role))
                {
                    Enum.TryParse(typeof(Role), request.Role, out var roleType);
                    queryableUsers = queryableUsers.Where(x => x.Role == (Role)roleType);
                }
                
                #endregion

                var queryableUsersCopy = await queryableUsers.ToListAsync();

                if (queryableUsers.ToList().Count < request.Limit)
                    request.Limit = queryableUsers.ToList().Count;

                var users = new List<NormalUser>();

                var recentUsers = queryableUsersCopy.OrderByDescending(x => x.RegistrationDate).Skip(request.Offset ?? 0).Take(request.Limit ?? 6).ToList();

                foreach (var u in recentUsers)
                {
                    users.Add(await _profileReader.ReadUserInfo(u.UserName));
                }

                return new UsersEnvelope
                {
                    UserList = users,
                    UserCount = queryableUsers.Count()
                };
            }
        }
    }
}
