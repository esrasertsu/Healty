using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class ReCAPTHAResponse
    {
        public bool Success { get; set; }
        public double Score { get; set; }
        public string Action { get; set; }
        public DateTime dateTime { get; set; }
        public string hostname { get; set; }
    }
}
