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
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); //pk vermeyi sağlıyor migration sırasında

            builder.Entity<Value>()
                .HasData(
                   new Value { Id = 1, Name = "Value 101" },
                   new Value { Id = 2, Name = "value 102" }

                );
        }
    }
}
