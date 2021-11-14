using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace Infrastructure.Sms
{
    public class SmsSender : ISmsSender
    {
        private readonly IOptions<TwilioSmsSettings> _settings;

        public SmsSender(IOptions<TwilioSmsSettings> settings)
        {
            _settings = settings;
        }

        public async Task<bool> SendSmsAsync(string phoneNumber)
        {
            TwilioClient.Init(_settings.Value.AccountSID, _settings.Value.AuthToken);

            var verification =  await VerificationResource.CreateAsync(
              to: phoneNumber,
              channel: "sms",
              pathServiceSid: _settings.Value.ServiceSid
          );

            if (verification.Status == "pending")
                return true;
            else return false;
           
        }
        public async Task<bool> VerifySmsAsync(string phoneNumber, string code)
        {
            TwilioClient.Init(_settings.Value.AccountSID, _settings.Value.AuthToken);

           var verificationCheck = await VerificationCheckResource.CreateAsync(
               to: phoneNumber,
               code: code,
               pathServiceSid: _settings.Value.ServiceSid
           );

            if (verificationCheck.Status == "approved")
                return true;
            return false;
        }
    }
}
