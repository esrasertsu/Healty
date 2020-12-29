using AutoMapper;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.Profiles
{
    public class FollowingResolver : IValueResolver<AppUser, Profile, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public bool Resolve(AppUser source, Profile destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername()).Result;

            if (currentUser.Followings.Any(x => x.TargetId == source.Id))
                return true;

            return false;
        }
    }
}
