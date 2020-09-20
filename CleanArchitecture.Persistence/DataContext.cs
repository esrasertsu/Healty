using CleanArchitecture.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Persistence
{
    //as I use persistent db, I need to extend my DataContext from Entity Framework DbContext. So I add Entitiy Framework npm
    public class DataContext: DbContext 
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                   new Value { Id = 1, Name = "Value 101" },
                   new Value { Id = 2, Name = "value 102" }

                );
        }
    }
}
