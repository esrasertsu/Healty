using AutoMapper;
using CleanArchitecture.API.Middleware;
using CleanArchitecture.API.SignalR;
using CleanArchitecture.Application.Activities;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Application.Validators;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation.AspNetCore;
using Infrastructure.Agora;
using Infrastructure.Email;
using Infrastructure.Payment;
using Infrastructure.Photos;
using Infrastructure.Security;
using Infrastructure.Sms;
using Infrastructure.Zoom;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        //dependency injection container -- add new serviceses here! AddScoped 
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                //opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                opt.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                    mySqlOptionsAction: opt => { opt.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                    });
            });

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
                //opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), builder =>
                //{
                //    builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                //});
            });

            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    policy.AllowAnyHeader()
                    .AllowAnyMethod()
                     .WithExposedHeaders("WWW-Authenticate")
                     .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://sandbox-api.iyzipay.com", "https://afitapp.com",
                    "https://admin.afitapp.com", "http://localhost:9000", "https://meet.afitapp.com")
                    .AllowCredentials();
                });
            });

            services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);
            services.AddAutoMapper(typeof(Application.Activities.List.Handler));
            services.AddSignalR(hubOptions =>
            {
                hubOptions.EnableDetailedErrors = true;
                hubOptions.KeepAliveInterval = TimeSpan.FromMinutes(60);
            });

            services.AddControllers( opt => {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Application.Activities.Create>();
                cfg.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
            });
            // .AddNewtonsoftJson(options =>
            //     options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            // );

            var builder = services.AddIdentityCore<AppUser>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
                options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
            }).AddErrorDescriber<CustomIdentityErrorDescriber>();

            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddRoles<IdentityRole>();
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();
            identityBuilder.AddDefaultTokenProviders();

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new HostRequirement());
                });
                opt.AddPolicy("IsActivityAttendee", policy =>
                {
                    policy.Requirements.Add(new AttendeeRequirement());
                });
                opt.AddPolicy("CanCreateActivity", policy =>
                {
                    policy.Requirements.Add(new ActivityRoleRequirement());
                });
                opt.AddPolicy("IsAdmin", policy =>
                {
                    policy.Requirements.Add(new AdminRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, HostRequirementHandler>();//only available for the liftetime of the operation not the complete request
            services.AddTransient<IAuthorizationHandler, ActivityRoleRequirementHandler>();
            services.AddTransient<IAuthorizationHandler, AttendeeRequirementHandler>();
            services.AddTransient<IAuthorizationHandler, AdminRequirementHandler>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer( opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false, //alıcı verici urller
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if(!string.IsNullOrEmpty(accessToken) && ((path.StartsWithSegments("/chat")) || (path.StartsWithSegments("/message"))))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                }
               );
            services.AddHttpContextAccessor();
            services.ConfigureApplicationCookie(options => { 
                options.Cookie.SameSite = SameSiteMode.None;
                options.LoginPath = new PathString("/login-required");
                options.LogoutPath = new PathString("/");
                options.Cookie.MaxAge = TimeSpan.FromDays(7);
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.Cookie.HttpOnly = true;
                options.SlidingExpiration = true;
                options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
            });


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

            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
            services.Configure<ZoomSettings>(Configuration.GetSection("Zoom"));
            services.Configure<IyzicoSettings>(Configuration.GetSection("Iyzico"));
            services.Configure<FacebookAppSettings>(Configuration.GetSection("Authentication:Facebook"));
            services.Configure<SendGridSettings>(Configuration.GetSection("SendGrid"));
            services.Configure<TwilioSmsSettings>(Configuration.GetSection("Twilio"));
            services.Configure<AgoraSettings>(Configuration.GetSection("Agora"));
            services.Configure<ReCAPTCHASettingsModel>(Configuration.GetSection("Authentication:ReCAPTCHA"));
            services.Configure<GoogleLoginAppSettings>(Configuration.GetSection("Authentication:Google"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>(); // always top 

           
            //   app.UseRequestResponseLogging();

            // app.UseHttpsRedirection();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(x => x.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(op => op.Deny());

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
            }
            else
            {
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, "Templates")
                    ),
                RequestPath = "/Templates"
            });
            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapHub<MessagesHub>("/message");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
