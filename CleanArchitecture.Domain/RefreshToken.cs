using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public virtual AppUser AppUser { get; set; }
        public string Token { get; set; }
        public DateTime LastRefreshed { get; set; } = DateTime.UtcNow;
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null & !IsExpired;

    }
}
