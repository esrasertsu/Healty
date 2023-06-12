using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.API.Dtos
{
    public class RegisterWaitingTrainerDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        //[RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
        public string Password { get; set; }
        public string RePassword { get; set; }

        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string UserName { get; set; }
        public string Phone { get; set; }
        public bool HasSignedContract { get; set; }
        public List<Guid> CategoryIds { get; set; }
    }
}