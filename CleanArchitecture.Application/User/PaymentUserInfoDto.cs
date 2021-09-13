using CleanArchitecture.Application.Location;
using CleanArchitecture.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.User
{
    public class PaymentUserInfoDto
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string GsmNumber { get; set; }
        public bool HasSignedIyzicoContract { get; set; }
        public string Address { get; set; }
        public virtual CityDto City { get; set; }
        public Guid ActivityId { get; set; }
        public int TicketCount { get; set; }


    }
}
