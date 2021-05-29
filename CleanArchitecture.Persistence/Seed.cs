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
                        Name = "Atletizm",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Avcılık ve Atıcılık",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Badminton",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Bedensel Engelliler",
                        Category= Spor
                    },
                        new SubCategory
                    {
                        Name = "Bilardo",
                        Category= Spor
                    },
                          new SubCategory
                    {
                        Name = "Binicilik",
                        Category= Spor
                    },
                            new SubCategory
                    {
                        Name = "Bisiklet",
                        Category= Spor
                    },
                              new SubCategory
                    {
                        Name = "Bocce-Bowling-Dart",
                        Category= Spor
                    },
                                new SubCategory
                    {
                        Name = "Boks",
                        Category= Spor
                    },
                                  new SubCategory
                    {
                        Name = "Briç",
                        Category= Spor
                    },
                                    new SubCategory
                    {
                        Name = "Buz Hokeyi",
                        Category= Spor
                    },
                                      new SubCategory
                    {
                        Name = "Buz Pateni",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Cimnastik",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Dağcılık",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Eskrim",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Futbol",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Golf",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Görme Engelliler",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Güreş",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Halk Oyunları",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Halter",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Hentbol",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Hokey",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "İşitme Engelliler",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Judo",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Kano",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Karate",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Kayak",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Kick Boks",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Kürek",
                        Category= Spor
                    },
                       new SubCategory
                    {
                        Name = "Okçuluk",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Ragbi",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Satranç",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Su Altı Sporları",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Su Topu",
                        Category= Spor
                    },
                       new SubCategory
                    {
                        Name = "Taekwon-do",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Tenis",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Triatlon",
                        Category= Spor
                    },
                      new SubCategory
                    {
                        Name = "Voleybol",
                        Category= Spor
                    },
                     new SubCategory
                    {
                        Name = "Fitness - Vücut Geliştirme",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Yelken",
                        Category= Spor
                    },
                    new SubCategory
                    {
                        Name = "Yüzme",
                        Category= Spor
                    },

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


            var online =  await context.Accessibilities.SingleOrDefaultAsync(x => x.Name == "Online");
            var OwnPlace = await context.Accessibilities.SingleOrDefaultAsync(x => x.Name == "OwnPlace");

            var Swim = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Yüzme");
            var Diyabet = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Diyabet");
            var Yoga = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Yoga");
            var Pedagoji = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Pedagoji");

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
                        SubCategories= new List<SubCategory>(){ Swim },
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
                        SubCategories= new List<SubCategory>(){ Swim },
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
                         SubCategories= new List<SubCategory>(){ Swim },
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
                         SubCategories= new List<SubCategory>(){ Swim },
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
                        SubCategories =  new List<SubCategory>(){  context.SubCategories.FirstOrDefault(x => x.Name == "Yüzme") },
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
                        Category = await context.Categories.SingleOrDefaultAsync(x => x.Name == "Meditasyon"),
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
                        Category = await context.Categories.SingleOrDefaultAsync(x => x.Name == "Psikoloji"),
                        SubCategories =  new List<SubCategory>(){ await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Yoga") },
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
                        Date = DateTime.Now.AddMonths(3),
                        Description = "The header spscroll, which smooth scrolls some link clicks, was globally targeting any element with data-scroll… a shared attribute that your plugin also uses. I updated the specificity on this to target the header data-scroll elements only, and all is right in the universe.Thanks for the quick response.Close this puppy up as resolved",
                        Category = await context.Categories.FirstOrDefaultAsync(x => x.Name == "Meditasyon"),
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