using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Admin.SubMerchants
{
    public class CommissionStatusDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public int TrainerCount { get; set; }
        public ICollection<SubMerchantInfo> Trainers { get; set; }
    }

    public class SubMerchantInfo {

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string SubMerchantKey { get; set; }
        public string SubMerchantType { get; set; }
        public string Role { get; set; }


    }
}
