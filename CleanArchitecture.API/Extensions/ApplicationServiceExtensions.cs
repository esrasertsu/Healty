using CleanArchitecture.Application.Core;
using CleanArchitecture.Application.Activities;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.Profiles;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;
using CleanArchitecture.Persistence;
using Infrastructure.Zoom;
using Infrastructure.Payment;
using Infrastructure.Email;
using Infrastructure.Sms;
using Infrastructure.Agora;

namespace CleanArchitecture.API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddDbContext<DataContext>(opt =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connectionString = config.GetConnectionString("DefaultConnection");

                // Depending on if in development or production, use either FlyIO
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    opt.UseLazyLoadingProxies();
                    //opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                    opt.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString),
                    mySqlOptionsAction: opt => { opt.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                    }); 
                }
                else
                {
                     opt.UseLazyLoadingProxies();
                    //opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                    opt.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString),
                    mySqlOptionsAction: opt => { opt.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                    }); 
                }
            });
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    policy.AllowAnyHeader()
                    .AllowAnyMethod()
                     .WithExposedHeaders("WWW-Authenticate") // , "Pagination"
                     .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://sandbox-api.iyzipay.com", "https://afitapp.com",
                    "https://admin.afitapp.com", "http://localhost:9000", "https://meet.afitapp.com")
                    .AllowCredentials();
                });
            });
            
            services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Application.Activities.Create>();
            services.AddHttpContextAccessor();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();
            services.AddScoped<IChatRoomReader, ChatRoomReader>();
            services.AddScoped<IVideoAccessor, VideoAccessor>();
            services.AddScoped<IActivityReader, ActivityReader>();
            services.AddScoped<IDocumentAccessor, DocumentAccessor>();
            services.AddScoped<IZoomAccessor, ZoomAccessor>();
            services.AddScoped<IPaymentAccessor, PaymentAccessor>();
            services.AddScoped<IFacebookAccessor, FacebookAccessor>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<ISmsSender, SmsSender>();
            services.AddScoped<IAgoraAccessor, AgoraAccessor>();
            services.AddScoped<IGoogleReCAPTCHAAccessor, GoogleReCAPTHAAccessor>();
            services.AddScoped<IGoogleAccessor, GoogleAccessor>();
            services.AddScoped<IUserCultureInfo, UserCultureInfo>();

            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.Configure<ZoomSettings>(config.GetSection("Zoom"));
            services.Configure<IyzicoSettings>(config.GetSection("Iyzico"));
            services.Configure<FacebookAppSettings>(config.GetSection("Authentication:Facebook"));
            services.Configure<SendGridSettings>(config.GetSection("SendGrid"));
            services.Configure<TwilioSmsSettings>(config.GetSection("Twilio"));
            services.Configure<AgoraSettings>(config.GetSection("Agora"));
            services.Configure<ReCAPTCHASettingsModel>(config.GetSection("Authentication:ReCAPTCHA"));
            services.Configure<GoogleLoginAppSettings>(config.GetSection("Authentication:Google"));

            services.AddSignalR(hubOptions =>
            {
                hubOptions.EnableDetailedErrors = true;
                hubOptions.KeepAliveInterval = TimeSpan.FromMinutes(60);
            });
            return services;
        }
    }
}