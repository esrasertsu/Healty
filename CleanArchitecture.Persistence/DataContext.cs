using CleanArchitecture.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Persistence
{
    public class DataContext: IdentityDbContext<AppUser> 
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<ActivityComment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<SubCatBlogs> SubCatBlogs { get; set; }
        public DbSet<UserProfileComment> UserProfileComments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<UserChatRooms> UserChatRooms { get; set; }
        public DbSet<Accessibility> Accessibilities { get; set; }
        public DbSet<City> Cities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); //pk vermeyi sağlıyor migration sırasında

            builder.Entity<UserActivity>(x => x.HasKey(ua => 
                new {ua.AppUserId, ua.ActivityId}));

            builder.Entity<UserActivity>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);
            
            
            builder.Entity<UserActivity>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(o => o.Target)
                  .WithMany(f => f.Followers)
                  .HasForeignKey(o => o.TargetId)
                  .OnDelete(DeleteBehavior.Restrict);
            });


            builder.Entity<UserProfileComment>()
                .HasOne(u => u.Author)
                .WithMany(a => a.SendComments)
                .HasForeignKey(u => u.AuthorId);

            builder.Entity<UserProfileComment>()
              .HasOne(u => u.Target)
              .WithMany(a => a.ReceivedComments)
              .HasForeignKey(u => u.TargetId);


            builder.Entity<SubCatBlogs>(x => x.HasKey(ua =>
               new { ua.SubCategoryId, ua.BlogId }));

            builder.Entity<SubCatBlogs>()
                .HasOne(u => u.Blog)
                .WithMany(a => a.SubCategories)
                .HasForeignKey(u => u.BlogId);


            builder.Entity<SubCatBlogs>()
                .HasOne(a => a.SubCategory)
                .WithMany(u => u.Blogs)
                .HasForeignKey(a => a.SubCategoryId);

            builder.Entity<Message>()
               .HasOne(a => a.ChatRoom)
               .WithMany(u => u.Messages)
               .HasForeignKey(a => a.ChatRoomId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserChatRooms>(x => x.HasKey(ua =>
             new { ua.ChatRoomId, ua.AppUserId }));

            builder.Entity<UserChatRooms>()
              .HasOne(a => a.AppUser)
              .WithMany(u => u.ChatRooms)
              .HasForeignKey(a => a.AppUserId)
              .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<UserChatRooms>()
              .HasOne(a => a.ChatRoom)
              .WithMany(u => u.Users)
              .HasForeignKey(a => a.ChatRoomId)
              .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
