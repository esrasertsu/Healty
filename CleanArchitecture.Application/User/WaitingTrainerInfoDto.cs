using CleanArchitecture.Application.Categories;
using CleanArchitecture.Application.Location;
using CleanArchitecture.Application.Profiles;
using CleanArchitecture.Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class WaitingTrainerInfoDto
    {
        public string Displayname { get; set; }
        public string Username { get; set; }
        public ICollection<AccessibilityDto> Accessibilities { get; set; }
        public ICollection<CategoryDto> Categories { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }
        public string Dependency { get; set; }
        public decimal ExperienceYear { get; set; }
        public string Experience { get; set; }
        public string Title { get; set; }
        public string PhoneNumber { get; set; }
        public string TCKNIdentityNo { get; set; }
        public string Iban { get; set; }
        public bool HasSignedContract { get; set; }
        public CityDto City { get; set; }
        public ICollection<Certificate> Certificates { get; set; }


    }
}
