using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class UserSellContract
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string TrainerName { get; set; }
        public string TrainerId { get; set; }
        public string ActivityId { get; set; }
        public string ActivityName { get; set; }
        public string ContractId { get; set; }
    }
}
