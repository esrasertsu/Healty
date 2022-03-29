using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class CommissionStatus
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public virtual ICollection<SubMerchant> SubMerchants { get; set; }
    }
}
