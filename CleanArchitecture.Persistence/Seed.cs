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
            if(!context.Levels.Any())
            {
                var levels = new List<Level>
                {
                    new Level
                    {
                        Name = "Başlangıç",

                    },
                    new Level
                    {
                        Name = "Orta",

                    },
                    new Level
                    {
                        Name = "İleri",

                    }
                };

                await context.Levels.AddRangeAsync(levels);
                var success = await context.SaveChangesAsync();

            }
            if (!context.Cities.Any())
            {
                var cities = new List<City>
                {
                    new City
                    {
                        Name = "İstanbul",

                    },
                    new City
                    {
                        Name = "Ankara",

                    },
                    new City
                    {
                        Name = "İzmir",

                    },
                    new City
                    {
                        Name = "Adana",

                    },
                    new City
                    {
                        Name = "Adıyaman",

                    },
                    new City
                    {
                        Name = "Afyon",

                    },
                    new City
                    {
                        Name = "Ağrı",

                    },
                    new City
                    {
                        Name = "Aksaray",

                    },
                    
                    new City
                    {
                        Name = "Amasya",

                    },
                    new City
                    {
                        Name = "Antalya",

                    },
                    new City
                    {
                        Name = "Ardahan",

                    },
                    new City
                    {
                        Name = "Artvin",

                    },
                    new City
                    {
                        Name = "Aydın",

                    },
                    new City
                    {
                        Name = "Balıkesir",

                    },
                    
                     new City
                    {
                        Name = "Bartın",

                    },
                      new City
                    {
                        Name = "Batman",

                    },
                     new City
                    {
                        Name = "Bayburt",

                    },
                   
                    new City
                    {
                        Name = "Bilecik",

                    },
                    new City
                    {
                        Name = "Bingöl",

                    },
                    new City
                    {
                        Name = "Bitlis",

                    },
                    new City
                    {
                        Name = "Bolu",

                    },
                    new City
                    {
                        Name = "Burdur",

                    },
                    new City
                    {
                        Name = "Bursa",

                    },
                    new City
                    {
                        Name = "Çanakkale",

                    },
                    new City
                    {
                        Name = "Çankırı",

                    },
                    new City
                    {
                        Name = "Çorum",

                    },
                    new City
                    {
                        Name = "Denizli",

                    },
                    new City
                    {
                        Name = "Diyarbakır",

                    },
                    
                    new City
                    {
                        Name = "Düzce",

                    },
                    new City
                    {
                        Name = "Edirne",

                    },
                    new City
                    {
                        Name = "Elâzığ",

                    },
                    new City
                    {
                        Name = "Erzincan",

                    },
                    new City
                    {
                        Name = "Erzurum",

                    },
                    new City
                    {
                        Name = "Eskişehir",

                    },
                    new City
                    {
                        Name = "Gaziantep",
                    },
                    new City
                    {
                        Name = "Giresun",

                    },
                    new City
                    {
                        Name = "Gümüşhane",

                    },
                    new City
                    {
                        Name = "Hakkâri",

                    },
                    new City
                    {
                        Name = "Hatay",

                    },
                     new City
                    {
                        Name = "Iğdır",

                    },
                    new City
                    {
                        Name = "Isparta",

                    },
                    new City
                    {
                        Name = "Mersin",

                    },
                       new City
                    {
                        Name = "Karaman",

                    },
                 
                    new City
                    {
                        Name = "Kars",

                    },
                    new City
                    {
                        Name = "Kastamonu",

                    },
                    new City
                    {
                        Name = "Kayseri",

                    },
                       new City
                    {
                        Name = "Kırıkkale",

                    },
                    new City
                    {
                        Name = "Kırklareli",

                    },
                    new City
                    {
                        Name = "Kırşehir",

                    },
                    new City
                    {
                        Name = "Kocaeli",

                    },
                    new City
                    {
                        Name = "Konya",

                    },
                    new City
                    {
                        Name = "Kütahya",

                    },
                    new City
                    {
                        Name = "Malatya",

                    },
                    new City
                    {
                        Name = "Manisa",

                    },
                    new City
                    {
                        Name = "Kahramanmaraş",

                    },
                     new City
                    {
                        Name = "Karabük",

                    },
                    new City
                    {
                        Name = "Kilis",

                    },
                    new City
                    {
                        Name = "Mardin",

                    },
                    new City
                    {
                        Name = "Muğla",

                    },
                    new City
                    {
                        Name = "Muş",

                    },
                    new City
                    {
                        Name = "Nevşehir",

                    },
                    new City
                    {
                        Name = "Niğde",

                    },
                    new City
                    {
                        Name = "Ordu",

                    },
                      new City
                    {
                        Name = "Osmaniye",

                    },
                    new City
                    {
                        Name = "Rize",

                    },
                    new City
                    {
                        Name = "Sakarya",

                    },
                    new City
                    {
                        Name = "Samsun",

                    },
                    new City
                    {
                        Name = "Siirt",

                    },
                    new City
                    {
                        Name = "Sinop",

                    },
                    new City
                    {
                        Name = "Sivas",

                    },
                    new City
                    {
                        Name = "Tekirdağ",

                    },
                    new City
                    {
                        Name = "Tokat",

                    },
                    new City
                    {
                        Name = "Trabzon",

                    },
                    new City
                    {
                        Name = "Tunceli",

                    },
                    new City
                    {
                        Name = "Şanlıurfa",

                    },
                    new City
                    {
                        Name = "Uşak",

                    },
                    new City
                    {
                        Name = "Van",

                    }
                    ,
                    new City
                    {
                        Name = "Yalova",

                    },
                    new City
                    {
                        Name = "Yozgat",

                    },
                    new City
                    {
                        Name = "Zonguldak",

                    },
                    
                    new City
                    {
                        Name = "Şırnak",

                    }
                };

                await context.Cities.AddRangeAsync(cities);
                await context.SaveChangesAsync();
            }

            if (!context.Accessibilities.Any())
            {
                var accessibilities = new List<Accessibility>
                {
                    new Accessibility
                    {
                        Name = "Eğitmenin Yeri",
                       
                    },
                    new Accessibility
                    {
                        Name = "Danışanın Yeri",

                    },
                    new Accessibility
                    {
                        Name = "Online",

                    },
                    new Accessibility
                    {
                        Name = "Diğer",

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
            var OwnPlace = await context.Accessibilities.SingleOrDefaultAsync(x => x.Name == "Eğitmenin Yeri");

            var Swim = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Yüzme");
            var Diyabet = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Diyabet");
            var Yoga = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Yoga");
            var Pedagoji = await context.SubCategories.SingleOrDefaultAsync(x => x.Name == "Pedagoji");

            var ortaLevel = await context.Levels.SingleOrDefaultAsync(x => x.Name == "Orta");


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
                        Title="Personal Trainer",
                        Role=Role.Trainer,
                        Experience="çok tecrübeliyim yıllarıdr bu işi yapıyorum",
                        ExperienceYear=5,
                        Dependency="MacFit",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        EmailConfirmed = true,
                        UserAccessibilities = new List<UserAccessibility>
                        {
                            new UserAccessibility
                            {
                                AppUserId = "a",
                                AccessibilityId = online.Id
                            },
                            new UserAccessibility
                            {
                                AppUserId = "a",
                                AccessibilityId = OwnPlace.Id
                            }
                        },
                         UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "a",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "a",
                                Category = Spor
                            },
                        }
                       
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com",
                        Title="Personal Trainer",
                        Role=Role.Trainer,
                         ExperienceYear=5,
                        Dependency="MacFit",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        EmailConfirmed = true,
                        UserAccessibilities = new List<UserAccessibility>
                        {
                            new UserAccessibility
                            {
                                AppUserId = "b",
                                AccessibilityId = online.Id
                            },
                            new UserAccessibility
                            {
                                AppUserId = "b",
                                Accessibility = OwnPlace
                            }
                        } ,
                         UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "b",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "b",
                                Category = Spor
                            },
                        }                         
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com",
                        Role=Role.Trainer,
                         ExperienceYear=3,
                        Title="Yoga Uzmanı",
                        Dependency="Tom'un Yeri",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        EmailConfirmed = true,
                          UserAccessibilities = new List<UserAccessibility>
                        {
                            new UserAccessibility
                            {
                                AppUserId = "c",
                                Accessibility = online
                            },
                            new UserAccessibility
                            {
                                AppUserId = "c",
                                Accessibility = OwnPlace
                            }
                        } ,
                         UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "c",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "c",
                                Category = Spor
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "d",
                        DisplayName = "Esra",
                        UserName = "esra",
                        Email = "esra@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=2,
                       Title="Basketbol Antrenoru",
                        Dependency="Esra'un Yeri",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       EmailConfirmed = true,
                      UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "d",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "d",
                                Category = Spor
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "e",
                        DisplayName = "Steve",
                        UserName = "Steve",
                        Email = "steve@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=1,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "e",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "e",
                                Category = Spor
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "f",
                        DisplayName = "Ahmet",
                        UserName = "ahmet",
                        Email = "ahmet@test.com",
                        Role=Role.Trainer,
                        ExperienceYear=3,
                       ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                          UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "f",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "f",
                                Category = Spor
                            },
                        }
                    },
                    new AppUser
                    {
                        Id = "g",
                        DisplayName = "Semih",
                        UserName = "semih",
                        Email = "semih@test.com",
                        Role=Role.Trainer,
                        Title="Tenis Antrenorü",
                       ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserAccessibilities = new List<UserAccessibility>
                        {
                            new UserAccessibility
                            {
                                AppUserId = "g",
                                AccessibilityId = online.Id
                            },
                            new UserAccessibility
                            {
                                AppUserId = "g",
                                Accessibility = OwnPlace
                            }
                        } ,
                         UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "g",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "g",
                                Category = Spor
                            },
                        }
                    },
                     new AppUser
                    {
                        Id = "h",
                        DisplayName = "Jack",
                        UserName = "jack",
                        Email = "jack@test.com",
                        Role=Role.Trainer,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                      UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "h",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "h",
                                Category = Spor
                            },
                        }

                    },
                     new AppUser
                    {
                        Id = "j",
                        DisplayName = "Johny",
                        UserName = "johny",
                        Email = "johny@test.com",
                        Role=Role.Trainer,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                          UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "j",
                                Category = Psikoloji
                            },
                             new UserCategories
                            {
                                AppUserId = "j",
                                Category = Spor
                            },
                        }
                    },
                new AppUser
                {
                    Id = "k",
                    DisplayName = "Kağan Onbaşılar",
                    UserName = "kagan",
                    Email = "kagan@test.com",
                    Role = Role.Trainer,
                    Experience = "çok tecrübeliyim yıllarıdr bu işi yapıyorum",
                    ExperienceYear = 5,
                    Dependency = "MacFit",
                    ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "k",
                                Category = Meditasyon
                            }
                        }
                },
                    new AppUser
                    {
                        Id = "l",
                        DisplayName = "Lale Can",
                        UserName = "lale",
                        Email = "lale@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 5,
                        Dependency = "MacFit",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "l",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "l",
                                Category = Spor
                            },
                        }
                    },
                    new AppUser
                    {
                        Id = "m",
                        DisplayName = "Murat Durak",
                        UserName = "murat",
                        Email = "murat@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 3,
                        Dependency = "Tom'un Yeri",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                           
                             new UserCategories
                            {
                                AppUserId = "m",
                                Category = Spor
                            },
                        },
                        
                    },
                    new AppUser
                    {
                        Id = "n",
                        DisplayName = "Ayse Sert",
                        UserName = "ayse",
                        Email = "ayse@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 2,
                        Dependency = "Esra'un Yeri",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                          UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "n",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "n",
                                Category = Diyet
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "o",
                        DisplayName = "Begüm",
                        UserName = "begum",
                        Email = "begum@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 1,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                      UserCategories = new List<UserCategories>
                        {
                            
                             new UserCategories
                            {
                                AppUserId = "o",
                                Category = Spor
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "p",
                        DisplayName = "Pınar Saylak",
                        UserName = "pinar",
                        Email = "pinar@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 3,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "p",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "p",
                                Category = Spor
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "r",
                        DisplayName = "Rasim Ok",
                        UserName = "rasim",
                        Email = "rasim@test.com",
                        Role = Role.Trainer,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "r",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "r",
                                Category = Spor
                            },
                        }

                    },
                     new AppUser
                     {
                         Id = "s",
                         DisplayName = "Süleyman Soymanlı",
                         UserName = "sulu",
                         Email = "sulu@test.com",
                         Role = Role.User,
                         ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "s",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "s",
                                Category = Spor
                            },
                        }

                     },
                     new AppUser
                     {
                         Id = "t",
                         DisplayName = "Tayfun Demircili",
                         UserName = "tayfun",
                         Email = "tayfun@test.com",
                         Role = Role.Trainer,
                         ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                          UserCategories = new List<UserCategories>
                        {
                            
                             new UserCategories
                            {
                                AppUserId = "t",
                                Category = Spor
                            },
                        }
                     },
            new AppUser
            {
                Id = "u",
                DisplayName = "Ulaş Çekmeköy",
                UserName = "ulas",
                Email = "ulas@test.com",
                Role = Role.Trainer,
                Experience = "çok tecrübeliyim yıllarıdr bu işi yapıyorum",
                ExperienceYear = 5,
                Dependency = "MacFit",
                ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                 UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "u",
                                Category = Meditasyon
                            }
                        }

            },
                    new AppUser
                    {
                        Id = "v",
                        DisplayName = "Veli Ali Elli",
                        UserName = "veli",
                        Email = "veli@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 5,
                        Dependency = "MacFit",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "v",
                                Category = Diyet
                            },
                             new UserCategories
                            {
                                AppUserId = "v",
                                Category = Spor
                            },
                        }
                    },
                    new AppUser
                    {
                        Id = "y",
                        DisplayName = "Yasin",
                        UserName = "yasin",
                        Email = "yasin@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 3,
                        Dependency = "Tom'un Yeri",
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                         UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "y",
                                Category = Diyet
                            }
                        }

                    },
                    new AppUser
                    {
                        Id = "z",
                        DisplayName = "Zehra Durali",
                        UserName = "zehra",
                        Email = "zehra@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 2,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        Dependency = "Esra'un Yeri",
                      UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "z",
                                Category = Psikoloji
                            }
                        }

                    },
                    new AppUser
                    {
                        Id = "i",
                        DisplayName = "İnan Bektaşilili",
                        UserName = "inan",
                        Email = "inan@test.com",
                        Role = Role.Trainer,
                        ExperienceYear = 1,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "i",
                                Category = Psikoloji
                            }
                        }

                    },
                    new AppUser
                    {
                        Id = "ab",
                        DisplayName = "Ahmet Okçu",
                        UserName = "ahmeto",
                        Email = "ahmeto@test.com",
                        Role = Role.Trainer,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                        ExperienceYear = 3,
                        UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "ab",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "ab",
                                Category = Psikoloji
                            },
                        }

                    },
                    new AppUser
                    {
                        Id = "st",
                        DisplayName = "Semih Tınaztepe",
                        UserName = "semiht",
                        Email = "semiht@test.com",
                        Role = Role.Trainer,
                        ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "st",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "st",
                                Category = Diyet
                            },
                        }

                    },
                     new AppUser
                     {
                         Id = "iuc",
                         DisplayName = "İbrahim Uğur Caner",
                         UserName = "ibo",
                         Email = "ibo@test.com",
                         Role = Role.Trainer,
                         ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "iuc",
                                Category = Meditasyon
                            },
                             new UserCategories
                            {
                                AppUserId = "iuc",
                                Category = Diyet
                            },
                        }

                     },
                     new AppUser
                     {
                         Id = "kd",
                         DisplayName = "Kerimcan Durmaz",
                         UserName = "kerimcan",
                         Email = "kerimcan@test.com",
                         Role = Role.Trainer,
                         ApplicationDate = DateTime.Now,
                        RegistrationDate = DateTime.Now,
                       UserCategories = new List<UserCategories>
                        {
                            new UserCategories
                            {
                                AppUserId = "kd",
                                Category = Diyet
                            },
                             new UserCategories
                            {
                                AppUserId = "kd",
                                Category = Spor
                            },
                        }
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
                        Venue = "Pub",
                        Online= true,
                        Price= Convert.ToDecimal("100"),
                        AttendancyLimit = 15,
                         AttendanceCount=0,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        },
                         Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Spor
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Swim.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Past Activity 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Activity 1 month ago",
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Meditasyon
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Yoga.Id
                            }
                        },
                        Venue = "The Louvre",
                         AttendancyLimit = 5,
                         AttendanceCount=1,
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
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }

                    },
                    new Activity
                    {
                        Title = "Future Activity 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Activity 1 month in future",
                        Venue = "Wembly Stadium",
                        Price= Convert.ToDecimal("200"),
                         AttendanceCount=1,
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
                        },
                         Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Spor
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Swim.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 2",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "The header spscroll, which smooth scrolls some link clicks, was globally targeting any element with data-scroll… a shared attribute that your plugin also uses. I updated the specificity on this to target the header data-scroll elements only, and all is right in the universe.Thanks for the quick response.Close this puppy up as resolved",
                        Venue = "Pub",
                         Online= true,
                         Price= Convert.ToDecimal("200"),
                         AttendanceCount=1,
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
                        },
                         Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4 months in future",
                        Venue = "British Museum",
                        Price= Convert.ToDecimal("100"),
                         Online= true,
                          AttendanceCount=0,
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(4)
                            }
                        },
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Activity 5 months in future",
                        Venue = "Punch and Judy",
                        Price= Convert.ToDecimal("200"),
                         Online= true,
                          AttendanceCount=1,
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
                        },
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                        Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Activity 6 months in future",
                        Price= Convert.ToDecimal("300"),
                        Venue = "O2 Arena",
                         AttendanceCount=1,
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
                        },
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Activity 7 months in future",
                        Venue = "All",
                        Price= Convert.ToDecimal("150"),
                        Online= true,
                         AttendanceCount=1,
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
                        },
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Activity 8 months in future",
                        Venue = "Pub",
                         Online= true,
                         Price= null,
                          AttendanceCount=1,
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
                        },
                        Categories  = new List<ActivityCategories>
                        {
                            new ActivityCategories
                            {
                                Category = Psikoloji
                            }
                        },
                        SubCategories =  new List<ActivitySubCategories>
                        {
                            new ActivitySubCategories
                            {
                                SubCategoryId = Pedagoji.Id
                            }
                        },
                          Levels= new List<ActivityLevels>
                        {
                            new ActivityLevels
                            {
                                 Level = ortaLevel
                            }
                        }
                    }
                };
             

                await context.Activities.AddRangeAsync(activities);
                await context.SaveChangesAsync();
            }

          
        }
    }
}