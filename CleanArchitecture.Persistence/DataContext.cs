﻿using CleanArchitecture.Domain;
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
        public DbSet<Video> Videos { get; set; }
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
        public DbSet<UserAccessibility> UserAccessibilities { get; set; }
        public DbSet<UserCategories> UserCategories { get; set; }
        public DbSet<UserSubCategories> UserSubCategories { get; set; }
        public DbSet<ActivityLevels> ActivityLevels { get; set; }
        public DbSet<ActivityCategories> ActivityCategories { get; set; }
        public DbSet<ActivitySubCategories> ActivitySubCategories { get; set; }

        public DbSet<City> Cities { get; set; }
        public DbSet<Level> Levels { get; set; }

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
                .HasForeignKey(a => a.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);

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


            builder.Entity<UserCategories>(x => x.HasKey(ua =>
            new { ua.AppUserId, ua.CategoryId }));

            builder.Entity<UserCategories>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserCategories)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserCategories>()
                .HasOne(u => u.Category)
                .WithMany(a => a.UserCategories)
                .HasForeignKey(u => u.CategoryId);

            builder.Entity<UserSubCategories>(x => x.HasKey(ua =>
           new { ua.AppUserId, ua.SubCategoryId }));

            builder.Entity<UserSubCategories>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserSubCategories)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserSubCategories>()
                .HasOne(u => u.SubCategory)
                .WithMany(a => a.UserSubCategories)
                .HasForeignKey(u => u.SubCategoryId);


            builder.Entity<UserAccessibility>(x => x.HasKey(ua =>
        new { ua.AppUserId, ua.AccessibilityId }));

            builder.Entity<UserAccessibility>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserAccessibilities)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserAccessibility>()
                .HasOne(u => u.Accessibility)
                .WithMany(a => a.UserAccessibilities)
                .HasForeignKey(u => u.AccessibilityId);



            builder.Entity<ActivityCategories>(x => x.HasKey(ua =>
           new { ua.ActivityId, ua.CategoryId }));

            builder.Entity<ActivityCategories>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Categories)
                .HasForeignKey(u => u.ActivityId);

            builder.Entity<ActivityCategories>()
                .HasOne(u => u.Category)
                .WithMany(a => a.ActivityCategories)
                .HasForeignKey(u => u.CategoryId);

            builder.Entity<ActivitySubCategories>(x => x.HasKey(ua =>
           new { ua.ActivityId, ua.SubCategoryId }));

            builder.Entity<ActivitySubCategories>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.SubCategories)
                .HasForeignKey(u => u.ActivityId);

            builder.Entity<ActivitySubCategories>()
                .HasOne(u => u.SubCategory)
                .WithMany(a => a.ActivitySubCategories)
                .HasForeignKey(u => u.SubCategoryId);


            builder.Entity<ActivityLevels>(x => x.HasKey(ua =>
           new { ua.ActivityId, ua.LevelId }));

            builder.Entity<ActivityLevels>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Levels)
                .HasForeignKey(u => u.ActivityId);

            builder.Entity<ActivityLevels>()
                .HasOne(u => u.Level)
                .WithMany(a => a.Activities)
                .HasForeignKey(u => u.LevelId);

        }
    }
}
