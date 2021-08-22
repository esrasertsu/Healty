using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Zoom
{
    public class ZoomAccessor : IZoomAccessor
    {
        public string ApiKey = "";
        public string ApiSecret = "";
        public ZoomAccessor(IOptions<ZoomSettings> config)
        {
            ApiKey =   config.Value.ApiKey;
            ApiSecret = config.Value.ApiSecret;

        }
        static readonly char[] padding = { '=' };

        public string GenerateToken(string meetingNumber, string ts, string role)
        {
            string message = String.Format("{0}{1}{2}{3}", ApiKey, meetingNumber, ts, role);
            ApiSecret = ApiSecret ?? "";
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(ApiSecret);
            byte[] messageBytesTest = encoding.GetBytes(message);
            string msgHashPreHmac = System.Convert.ToBase64String(messageBytesTest);
            byte[] messageBytes = encoding.GetBytes(msgHashPreHmac);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                string msgHash = System.Convert.ToBase64String(hashmessage);
                string token = String.Format("{0}.{1}.{2}.{3}.{4}", ApiKey, meetingNumber, ts, role, msgHash);
                var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
                return System.Convert.ToBase64String(tokenBytes).TrimEnd(padding);
            }
        }
        

    }
}
