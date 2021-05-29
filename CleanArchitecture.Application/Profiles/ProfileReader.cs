using AutoMapper;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Errors;
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
        private readonly IMapper _mapper;


        public ProfileReader(DataContext context, IUserAccessor userAccessor, IMapper mapper)
        {
            _context = context;
            _userAccessor = userAccessor;
            _mapper = mapper;
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
                Role = user.Role.ToString(),
                Experience= user.Experience,
                ExperienceYear = user.ExperienceYear,
                Certificates = user.Certificates,
                Dependency= user.Dependency,
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count(),
                StarCount = GetStarCount(user),
                Star = CalculateStar(user),
                IsOnline = user.IsOnline,
                ResponseRate = CalculateResponseRate(user),
                Accessibilities = _mapper.Map<ICollection<Accessibility>, ICollection<AccessibilityDto>>(user.Accessibilities),
                Categories = _mapper.Map<ICollection<Category>, ICollection<CategoryDto>>(user.Categories),
                SubCategories = _mapper.Map<ICollection<SubCategory>, ICollection<SubCategoryDto>>(user.SubCategories),
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
            {
                profile.IsFollowed = true;
            }

            var queryable = _context.UserChatRooms.AsQueryable();

            var chatRooms = queryable.Where(x => x.AppUserId == currentUser.Id);

           

                var existingChatRoomWithReceiver =  queryable
                     .Where(x => chatRooms.Any(y => y.ChatRoomId == x.ChatRoomId) && x.AppUserId == user.Id);

                if (existingChatRoomWithReceiver.Count() >0 )
                {
                    profile.HasConversation = true;
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
        private int CalculateResponseRate(AppUser user)
        {
           var receivedFirstMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id).DefaultIfEmpty().Count();
           var respondedMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.Messages.Any(x => x.SenderId == user.Id)).DefaultIfEmpty().Count();

           var rate = Convert.ToInt32(100 * respondedMessagesCount / receivedFirstMessagesCount);
            return rate;
        }
    }
}
