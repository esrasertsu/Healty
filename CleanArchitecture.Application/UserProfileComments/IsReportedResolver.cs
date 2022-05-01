using AutoMapper;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Application.UserProfileComments
{
    public class IsReportedResolver : IValueResolver<UserProfileComment, UserProfileCommentDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public IsReportedResolver(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public bool Resolve(UserProfileComment source, UserProfileCommentDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername()).Result;

            if(currentUser == null)
                return false;

            if (source.Reports.Any(x => x.ReportedBy == currentUser.UserName))
                return true;

            return false;
        }
    }
}
