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
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.User
{
    public class RegisterWaitingTrainer
    {
        public class Command : IRequest<Unit>
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string RePassword { get; set; }
            public string Phone { get; set; }
            public bool HasSignedContract { get; set; }
            public string Origin { get; set; }

        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IEmailSender _emailSender;


            public Handler(DataContext context, UserManager<AppUser> userManager, IEmailSender emailSender)
            {
                _context = context;
                _userManager = userManager;
                _emailSender = emailSender;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });

                if (await _context.Users.AnyAsync(x => x.UserName == request.UserName))
                    throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists." });

                if(request.RePassword != request.Password)
                    throw new RestException(HttpStatusCode.BadRequest, new { Password = "Password doesn't match." });

                var phone = request.Phone.Trim();
                if (!phone.StartsWith("+"))
                    phone = "+" + phone;

                var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email,
                        UserName = request.UserName,
                        Role = Role.WaitingTrainer,
                        ApplicationDate = DateTime.Now,
                        PhoneNumber = phone,
                        PhoneNumberConfirmed = true
                    };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { UserName = "Problem creating user" });

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";

                var message = $"<p>Merhaba,</p><p>Email adresini aşağıdaki linke tıklayarak doğrulayabilir ve siteye giriş yapabilirsiniz.</p><p><a href='{verifyUrl}'>{verifyUrl}></a></p>";

                await _emailSender.SendEmailAsync(request.Email, "Hesap Doğrulama", message);

                return Unit.Value;

            }
        }
    }
}
