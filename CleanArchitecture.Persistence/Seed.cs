using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {

            if (!context.Accessibilities.Any())
            {
                var accessibilities = new List<Accessibility>
                {
                    new Accessibility
                    {
                        Name = "OwnPlace",
                       
                    },
                    new Accessibility
                    {
                        Name = "CustomerPlace",

                    },
                    new Accessibility
                    {
                        Name = "Online",

                    },
                    new Accessibility
                    {
                        Name = "Other",

                    }
                };

                await context.Accessibilities.AddRangeAsync(accessibilities);
                var a =  await context.SaveChangesAsync();
            }

            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                      new Category
                    {
                        Name = "Psikoloji",
                       
                      },
                       new Category
                    {
                        Name = "Meditasyon",
                     
                       },
                        new Category
                    {
                        Name = "Diyet",

                    },
                       new Category
                    {
                        Name = "Spor"
                    },
                };

                await context.Categories.AddRangeAsync(categories);
                var a = await context.SaveChangesAsync();
            }

            var Meditasyon =  context.Categories.FirstOrDefault(x => x.Name == "Meditasyon");
            var Spor =  context.Categories.FirstOrDefault(x => x.Name == "Spor");
            var Diyet =  context.Categories.FirstOrDefault(x => x.Name == "Diyet");
            var Psikoloji = context.Categories.FirstOrDefault(x => x.Name == "Psikoloji");

            if (!context.SubCategories.Any())
            {
                var subCategories = new List<SubCategory>
                {
                   
                    new SubCategory
                    {
                        Name = "Fitness",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Vücut Geliştirme",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Pilates",
                        Category= Spor
                    }
                        
                    ,
                    
                    new SubCategory
                    {
                        Name = "Diyabet",
                        Category= Diyet
                    },
                    new SubCategory
                    {
                        Name = "Kilo Verme",
                        Category= Diyet
                    }

                    ,
                   
                    new SubCategory
                    {
                        Name = "Pedagoji",
                        Category= Psikoloji
                    },
                    new SubCategory
                    {
                        Name = "Bağımlılık",
                        Category= Psikoloji

                    }
                         ,
                        new SubCategory
                            {
                                Name = "Nefes Terapisi",
                                Category= Meditasyon
                            },
                           new SubCategory
                            {
                                Name = "Yoga",
                                Category= Meditasyon
                            }
                          
                };

                await context.SubCategories.AddRangeAsync(subCategories);
              var a =  await context.SaveChangesAsync();
            }


            var online =  context.Accessibilities.FirstOrDefault(x => x.Name == "Online");
            var OwnPlace =  context.Accessibilities.FirstOrDefault(x => x.Name == "OwnPlace");

            var Fitness =  context.SubCategories.FirstOrDefault(x => x.Name == "Fitness");
            var Diyabet =  context.SubCategories.FirstOrDefault(x => x.Name == "Diyabet");
            var Yoga =  context.SubCategories.FirstOrDefault(x => x.Name == "Yoga");
            var Pedagoji =  context.SubCategories.FirstOrDefault(x => x.Name == "Pedagoji");

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com",
                        Role=Role.Trainer,
                        Experience="çok tecrübeliyim yıllarıdr bu işi yapıyorum",
                        ExperienceYear=5,
                        Dependency="MacFit",
                        Accessibilities= new List<Accessibility>(){ online, OwnPlace },
                        Categories= new List<Category>(){ context.Categories.FirstOrDefault(x => x.Name == "Spor") },
                       SubCategories= new List<SubCategory>(){ context.SubCategories.FirstOrDefault(x => x.Name == "Fitness") },

                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com",
                        Role=Role.Trainer,
                         ExperienceYear=5,
                        Dependency="MacFit",
                         Accessibilities= new List<Accessibility>(){OwnPlace},
                        SubCategories= new List<SubCategory>(){ Fitness },
                        Categories= new List<Category>(){ Spor },
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com",
                        Role=Role.Trainer,
                         ExperienceYear=3,
                        Dependency="Tom'un Yeri",
                         Accessibilities= new List<Accessibility>(){ OwnPlace},
                         Categories= new List<Category>(){ Diyet },
                         SubCategories= new List<SubCategory>(){ Diyabet }

                    },
                    new AppUser
                    {
                        Id = "d",
                        DisplayName = "Esra",
                        UserName = "esra",
                        Email = "esra@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=2,
                        Dependency="Esra'un Yeri",
                        Accessibilities= new List<Accessibility>(){ online, OwnPlace},
                        Categories = new List<Category>(){ Meditasyon },
                         SubCategories= new List<SubCategory>(){ Yoga }

                    },
                    new AppUser
                    {
                        Id = "e",
                        DisplayName = "Steve",
                        UserName = "Steve",
                        Email = "steve@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=1,
                        Categories = new List<Category>(){Spor},
                        SubCategories= new List<SubCategory>(){ Fitness },
                        Accessibilities= new List<Accessibility>(){ online }

                    },
                    new AppUser
                    {
                        Id = "f",
                        DisplayName = "Ahmet",
                        UserName = "ahmet",
                        Email = "ahmet@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=3,
                        Categories = new List<Category>(){Psikoloji},
                        SubCategories= new List<SubCategory>(){ Pedagoji },
                       Accessibilities= new List<Accessibility>(){ online }

                    },
                    new AppUser
                    {
                        Id = "g",
                        DisplayName = "Semih",
                        UserName = "semih",
                        Email = "semih@test.com",
                        Role=Role.Trainer,
                        Categories = new List<Category>(){Psikoloji},
                        SubCategories= new List<SubCategory>(){ Pedagoji },
                       Accessibilities= new List<Accessibility>(){ online }

                    },
                     new AppUser
                    {
                        Id = "h",
                        DisplayName = "Jack",
                        UserName = "jack",
                        Email = "jack@test.com",
                        Role=Role.User,
                        Categories = new List<Category>(){Spor},
                         SubCategories= new List<SubCategory>(){ Fitness },
                         Accessibilities= new List<Accessibility>(){ online }

                    },
                     new AppUser
                    {
                        Id = "j",
                        DisplayName = "Johny",
                        UserName = "johny",
                        Email = "johny@test.com",
                        Role=Role.Trainer,
                           Categories = new List<Category>(){Spor,Diyet},
                         SubCategories= new List<SubCategory>(){ Fitness },
                         Accessibilities= new List<Accessibility>(){ online }
                    },
                };


                foreach (var user in users)
                {
                 
                    await roleManager.CreateAsync(new IdentityRole(user.Role.ToString()));
                    var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, user.Role.ToString());
                    }
                }
            }

            if (!context.Activities.Any())
            {
                var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Past Activity 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Activity 2 months ago",
                        Category = await context.Categories.SingleOrDefaultAsync(x => x.Name == "Spor"),
                        SubCategories =  new List<SubCategory>(){ await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Fitness") },
                        City = "London",
                        Venue = "Pub",
                        Level= Level.Beginner,
                        Online= true,
                        Price= Convert.ToDecimal("100"),
                         AttendanceCount=15,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Past Activity 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Activity 1 month ago",
                        Category =  context.Categories.FirstOrDefault(x => x.Name == "Meditasyon"),
                        SubCategories =  new List<SubCategory>(){  context.SubCategories.FirstOrDefault(x => x.Name == "Yoga") },
                        City = "Paris",
                        Venue = "The Louvre",
                        Level= Level.Beginner,
                         AttendanceCount=2,
                        Price= Convert.ToDecimal("500"),
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Activity 1 month in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Psikoloji"),
                        SubCategories =  new List<SubCategory>(){ context.SubCategories.FirstOrDefault(x => x.Name == "Yoga") },
                        City = "London",
                        Venue = "Wembly Stadium",
                        Price= Convert.ToDecimal("200"),
                        Level= Level.Expert,
                         AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Spor"),
                        City = "London",
                        Venue = "Jamies Italian",
                        Price= Convert.ToDecimal("300"),
                        Level= Level.MidLevel,
                         AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Meditasyon"),
                        City = "London",
                        Venue = "Pub",
                         Online= true,
                         Price= Convert.ToDecimal("200"),
                        Level= Level.MidLevel,
                         AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(3)
                            },
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(3)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Diyet"),
                        City = "London",
                        Venue = "British Museum",
                        Price= Convert.ToDecimal("100"),
                        Level= Level.MidLevel,
                         Online= true,
                          AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(4)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Activity 5 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Spor"),
                        City = "London",
                        Venue = "Punch and Judy",
                        Level= Level.Expert,
                        Price= Convert.ToDecimal("200"),
                         Online= true,
                          AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Activity 6 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Diyet"),
                        City = "London",
                        Price= Convert.ToDecimal("300"),
                        Venue = "O2 Arena",
                         AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(6)
                            },
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(6)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Activity 7 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Meditasyon"),
                        City = "Berlin",
                        Venue = "All",
                        Price= Convert.ToDecimal("150"),
                        Online= true,
                        Level= Level.Beginner,
                         AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(7)
                            },
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(7)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Activity 8 months in future",
                        Category = context.Categories.FirstOrDefault(x => x.Name == "Psikoloji"),
                        City = "London",
                        Venue = "Pub",
                         Online= true,
                         Price= null,
                          AttendanceCount=10,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(8)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(8)
                            },
                        }
                    }
                };

                await context.Activities.AddRangeAsync(activities);
                await context.SaveChangesAsync();
            }

          
        }
    }
}