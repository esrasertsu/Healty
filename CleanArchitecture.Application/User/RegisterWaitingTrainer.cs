using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class RegisterWaitingTrainer
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string RePassword { get; set; }
            public string Phone { get; set; }
            public bool HasSignedContract { get; set; }
            public List<Guid> CategoryIds { get; set; }
            public string Origin { get; set; }

        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IEmailSender _emailSender;
            private readonly IJwtGenerator _jwtGenerator;


            public Handler(DataContext context, UserManager<AppUser> userManager, IEmailSender emailSender, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _emailSender = emailSender;
                _jwtGenerator = jwtGenerator;

        }

        public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });

                var phone = request.Phone.Trim();
                if (!phone.StartsWith("+"))
                    phone = "+" + phone;

                var resfreshToken = _jwtGenerator.GenerateRefreshToken();

                var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email,
                        UserName = request.UserName,
                        Role = Role.WaitingTrainer,
                      //  ApplicationDate = DateTime.Now,
                        PhoneNumber = phone,
                        PhoneNumberConfirmed = true,
                        RegistrationDate = DateTime.Now,
                        IsOnline = true
            };

                user.RefreshTokens.Add(resfreshToken);


                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

                if (request.CategoryIds != null)
                {
                    foreach (var catId in request.CategoryIds)
                    {
                        var cat = await _context.Categories.SingleOrDefaultAsync(x => x.Id == catId);

                        if (cat == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Category = "NotFound" });
                        else
                        {
                            var userCategory = new UserCategories()
                            {
                                Category = cat,
                                AppUser = user
                            };
                            _context.UserCategories.Add(userCategory);
                        }
                    }
                }
                var result2 = await _context.SaveChangesAsync() > 0;

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";

                var message = $"<p>Merhaba,</p><p>Email adresini aşağıdaki linke tıklayarak doğrulayabilir ve siteye giriş yapabilirsiniz.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";

                await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", message);


               
                return new User(user, _jwtGenerator, resfreshToken.Token);

            }
        }
    }
}
