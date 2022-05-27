using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using System.Globalization;
using CleanArchitecture.Application.Interfaces;

namespace Infrastructure.Security
{
        public class UserCultureInfo : IUserCultureInfo
    {
            public UserCultureInfo()
            {
                //  TimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
                DateTimeFormat = "dd/MM/yyyy hh:mm:ss tt";
            }
            public string DateTimeFormat { get; set; }
            public TimeZoneInfo TimeZone { get; set; }

            public DateTime ConvertToLocalTime(string date)
            {
                bool isWindows = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

                if (isWindows)
                    TimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
                else TimeZone =  TimeZoneInfo.FindSystemTimeZoneById("Turkey");

                return TimeZoneInfo.ConvertTime(DateTime.Parse(date, new CultureInfo("tr-TR")), TimeZone);

            }
            public DateTime GetUserLocalTime()
            {
                bool isWindows = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

                if (isWindows)
                    TimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
                else TimeZone =  TimeZoneInfo.FindSystemTimeZoneById("Turkey");
                 return TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZone);
            }
            public DateTime GetUtcTime(DateTime datetime)
            {
                return TimeZoneInfo.ConvertTime(datetime, TimeZone).ToUniversalTime();
            }
        }
}
