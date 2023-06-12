namespace CleanArchitecture.API.Dtos
{
    public class LoginDto
    {
        public string EmailOrUserName { get; set; }
        public string Password { get; set; }
        public string ReCaptcha { get; set; }
    }
}