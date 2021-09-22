using AutoMapper;
using CleanArchitecture.API.Middleware;
using CleanArchitecture.API.SignalR;
using CleanArchitecture.Application.Activities;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Messages;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using FluentValidation.AspNetCore;
using Infrastructure.Payment;
using Infrastructure.Photos;
using Infrastructure.Security;
using Infrastructure.Zoom;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
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
                opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), builder =>
                {
                    builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                });
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
                  //  .AllowAnyOrigin();
                     .WithExposedHeaders("WWW-Authenticate")
                     .WithOrigins("http://localhost:3000", "http://localhost:9999")
                    .AllowCredentials();
                });
            });

            services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);
            services.AddAutoMapper(typeof(Application.Activities.List.Handler));
            services.AddSignalR();

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

            var builder = services.AddIdentityCore<AppUser>();

            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddRoles<IdentityRole>();
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new HostRequirement());
                });
                opt.AddPolicy("CanCreateActivity", policy =>
                {
                    policy.Requirements.Add(new ActivityRoleRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, HostRequirementHandler>();//only available for the liftetime of the operation not the complete request
            services.AddTransient<IAuthorizationHandler, ActivityRoleRequirementHandler>();

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

            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
            services.Configure<ZoomSettings>(Configuration.GetSection("Zoom"));
            services.Configure<IyzicoSettings>(Configuration.GetSection("Iyzico"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>(); // always top 

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //   app.UseRequestResponseLogging();

            // app.UseHttpsRedirection();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(x => x.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(op => op.Deny());
            app.UseCsp(opt => opt
                .BlockAllMixedContent()
                .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com","sha256-F4GpCPyRepgP5znjMD8sc7PEjzet5Eef4r09dEGPpTs="))
                .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com","data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com","blob:","data:"))
                .ScriptSources(s => s.Self().CustomSources("https://www.youtube.com", "sha256-eE1k/Cs1U0Li9/ihPPQ7jKIGDvR8fYw65VJw+txfifw="))
                );

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();
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
