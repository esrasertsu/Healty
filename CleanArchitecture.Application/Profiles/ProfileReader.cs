﻿using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                UserName = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                Role = user.Role,
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count(),
                StarCount = GetStarCount(user),
                Star = CalculateStar(user)
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
            {
                profile.IsFollowed = true;
            }

            return profile;
        }

        private int GetStarCount(AppUser user)
        {
            return  Convert.ToInt32(user.ReceivedComments.Count() >0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0);
        }
        private int CalculateStar(AppUser user)
        {
            return Convert.ToInt32(user.ReceivedComments.Count() > 0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0);
        }
    }
}
