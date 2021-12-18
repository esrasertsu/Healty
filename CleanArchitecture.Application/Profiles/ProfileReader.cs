using AutoMapper;
using CleanArchitecture.Application.Admin;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Location;
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


            var accessDtoToReturn = new List<AccessibilityDto>();

            foreach (var access in user.UserAccessibilities)
            {
                var accDto = new AccessibilityDto
                {
                    Key = access.Accessibility.Id.ToString(),
                    Text = access.Accessibility.Name,
                    Value = access.Accessibility.Id.ToString(),
                };

                accessDtoToReturn.Add(accDto);
            }

            var catsToReturn = new List<CategoryDto>();

            foreach (var cat in user.UserCategories)
            {
                var catDto = new CategoryDto
                {
                    Key = cat.Category.Id.ToString(),
                    Text = cat.Category.Name,
                    Value = cat.Category.Id.ToString(),
                };

                catsToReturn.Add(catDto);
            }

            var subcatsToReturn = new List<SubCategoryDto>();

            foreach (var cat in user.UserSubCategories)
            {
                var catDto = new SubCategoryDto
                {
                    Key = cat.SubCategory.Id.ToString(),
                    Text = cat.SubCategory.Name,
                    Value = cat.SubCategory.Id.ToString(),
                };

                subcatsToReturn.Add(catDto);
            }


            var profile = new Profile
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Title= user.Title,
                PhoneNumber= user.PhoneNumber,
                UserName = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                CoverImage = user.Photos.FirstOrDefault(x => x.IsCoverPic)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                Role = user.Role.ToString(),
                Experience= user.Experience,
                ExperienceYear = user.ExperienceYear,
                Certificates = user.Certificates,
                Dependency= user.Dependency,
                City = _mapper.Map<City, CityDto>(user.City),
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count(),
                StarCount = user.StarCount,
                Star = user.Star,
                IsOnline = user.IsOnline,
                ResponseRate = CalculateResponseRate(user),
                Accessibilities = accessDtoToReturn,
                Categories = catsToReturn,
                SubCategories = subcatsToReturn,
                RegDate = user.RegistrationDate,
                ActivityCount = user.UserActivities.Where(x=>x.IsHost).Count(),
                BlogCount = user.Blogs.Count(),
                InteractionCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id).Count(),
                VideoUrl = user.VideoUrl
        };
            if (currentUser != null)
            {
                if (currentUser.Followings.Any(x => x.TargetId == user.Id))
                {
                    profile.IsFollowed = true;
                }
                var queryable = _context.UserChatRooms.AsQueryable();

                var chatRooms = queryable.Where(x => x.AppUserId == currentUser.Id);

                var existingChatRoomWithReceiver = queryable
                     .Where(x => chatRooms.Any(y => y.ChatRoomId == x.ChatRoomId) && x.AppUserId == user.Id);

                if (existingChatRoomWithReceiver.Count() > 0)
                {
                    profile.HasConversation = true;
                }

            }
            else
            {
                profile.IsFollowed = false;
                profile.HasConversation = false;
            }

           
            return profile;
        }

        public async Task<Profile> ReadProfileCard(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());


            var accessDtoToReturn = new List<AccessibilityDto>();

            foreach (var access in user.UserAccessibilities)
            {
                var accDto = new AccessibilityDto
                {
                    Key = access.Accessibility.Id.ToString(),
                    Text = access.Accessibility.Name,
                    Value = access.Accessibility.Id.ToString(),
                };

                accessDtoToReturn.Add(accDto);
            }

            var catsToReturn = new List<CategoryDto>();

            foreach (var cat in user.UserCategories)
            {
                var catDto = new CategoryDto
                {
                    Key = cat.Category.Id.ToString(),
                    Text = cat.Category.Name,
                    Value = cat.Category.Id.ToString(),
                };

                catsToReturn.Add(catDto);
            }

            var subcatsToReturn = new List<SubCategoryDto>();

            foreach (var cat in user.UserSubCategories)
            {
                var catDto = new SubCategoryDto
                {
                    Key = cat.SubCategory.Id.ToString(),
                    Text = cat.SubCategory.Name,
                    Value = cat.SubCategory.Id.ToString(),
                };

                subcatsToReturn.Add(catDto);
            }


            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Title = user.Title,
                HasPhoneNumber= !string.IsNullOrEmpty(user.PhoneNumber),
                HasVideo = !string.IsNullOrEmpty(user.VideoUrl),
                UserName = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                CoverImage = user.Photos.FirstOrDefault(x => x.IsCoverPic)?.Url,
                ExperienceYear = user.ExperienceYear,
                City = _mapper.Map<City, CityDto>(user.City),
                FollowerCount = user.Followers.Count(),
                StarCount = user.StarCount,
                Star = user.Star,
                IsOnline = user.IsOnline,
                Accessibilities = accessDtoToReturn,
                Categories = catsToReturn,
                SubCategories = subcatsToReturn,
                RegDate = user.RegistrationDate,
                Role = user.Role.ToString()

            };
            if (currentUser != null)
            {
                if (currentUser.Followings.Any(x => x.TargetId == user.Id))
                {
                    profile.IsFollowed = true;
                }
            }

            return profile;

        }

        public async Task<Trainer> ReadTrainerInfo(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());


            var accessDtoToReturn = new List<AccessibilityDto>();

            foreach (var access in user.UserAccessibilities)
            {
                var accDto = new AccessibilityDto
                {
                    Key = access.Accessibility.Id.ToString(),
                    Text = access.Accessibility.Name,
                    Value = access.Accessibility.Id.ToString(),
                };

                accessDtoToReturn.Add(accDto);
            }

            var catsToReturn = new List<CategoryDto>();

            foreach (var cat in user.UserCategories)
            {
                var catDto = new CategoryDto
                {
                    Key = cat.Category.Id.ToString(),
                    Text = cat.Category.Name,
                    Value = cat.Category.Id.ToString(),
                };

                catsToReturn.Add(catDto);
            }

            var subcatsToReturn = new List<SubCategoryDto>();

            foreach (var cat in user.UserSubCategories)
            {
                var catDto = new SubCategoryDto
                {
                    Key = cat.SubCategory.Id.ToString(),
                    Text = cat.SubCategory.Name,
                    Value = cat.SubCategory.Id.ToString(),
                };

                subcatsToReturn.Add(catDto);
            }


            var trainer = new Trainer
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                PhoneConfirmed = user.PhoneNumberConfirmed,
                SubMerchantKey = user.SubMerchantKey,
                SubMerchantType = user.SubMerchantDetails?.MerchantType.ToString(),
                Address = user.Address,
                Title = user.Title,
                PhoneNumber = user.PhoneNumber,
                UserName = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                CoverImage = user.Photos.FirstOrDefault(x => x.IsCoverPic)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                Role = user.Role.ToString(),
                Experience = user.Experience,
                ExperienceYear = user.ExperienceYear,
                Certificates = user.Certificates,
                Dependency = user.Dependency,
                City = _mapper.Map<City, CityDto>(user.City),
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count(),
                StarCount = user.StarCount,
                Star = user.Star,
                IsOnline = user.IsOnline,
                ResponseRate = CalculateResponseRate(user),
                Accessibilities = accessDtoToReturn,
                Categories = catsToReturn,
                SubCategories = subcatsToReturn,
                RegDate = user.RegistrationDate,
                PastActivityCount = user.UserActivities.Where(a => a.Activity.Date < DateTime.Now && a.IsHost).Count(),
                FutureActivityCount = user.UserActivities.Where(a => a.Activity.Date >= DateTime.Now && a.IsHost).Count(),
                BlogCount = user.Blogs.Count(),
                InteractionCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id).Count(),
                VideoUrl = user.VideoUrl,
                IyzicoContractSignedDate = user.IyzicoContractSignedDate,
                ApplicationDate = user.ApplicationDate,
                LastLoginDate = user.LastLoginDate,
                LastProfileUpdatedDate = user.LastProfileUpdatedDate,
                Iban = user.SubMerchantDetails?.Iban
            };
           


            return trainer;
        }


        //private int GetStarCount(AppUser user)
        //{
        //    return  Convert.ToInt32(user.ReceivedComments.Count() >0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0);
        //}
        //private int CalculateStar(AppUser user)
        //{
        //    return Convert.ToInt32(user.ReceivedComments.Count() > 0 ? user.ReceivedComments.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0);
        //}
        private int CalculateResponseRate(AppUser user)
        {
           var receivedFirstMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id).Count();
           var respondedMessagesCount = user.ChatRooms.Where(x => x.ChatRoom.StarterId != user.Id & x.ChatRoom.Messages.Any(x => x.SenderId == user.Id) == true).Count();

            var rate = 0;
            if (receivedFirstMessagesCount > 0)
                 rate = Convert.ToInt32(100 * respondedMessagesCount / receivedFirstMessagesCount);
            return rate;
        }
    }
}
