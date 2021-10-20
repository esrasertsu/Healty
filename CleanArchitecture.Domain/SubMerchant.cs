using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class SubMerchant
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public string SubMerchantKey { get; set; }
        public MerchantType MerchantType { get; set; }
        public string Address { get; set; }
        public string TaxOffice { get; set; } //private,ltd
        public string TaxNumber { get; set; } //ltd
        public string ContactName { get; set; }
        public string ContactSurname { get; set; }
        public string LegalCompanyTitle { get; set; } //private,,ltd
        public string Email { get; set; }
        public string GsmNumber { get; set; }
        public string Name { get; set; }
        public string Iban { get; set; }
        public string IdentityNumber { get; set; }
        public string Currency { get; set; }
        public DateTime ApplicationDate { get; set; }
        public DateTime? LastEditDate { get; set; }
        public bool HasSignedContract { get; set; }
    }


    public enum MerchantType
    {
        Personal = 0,
        Limited = 1,
        Anonim = 2
    }
}


