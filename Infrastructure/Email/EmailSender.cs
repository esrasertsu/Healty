﻿using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<SendGridSettings> _settings;

        public EmailSender(IOptions<SendGridSettings> settings)
        {
            _settings = settings;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            var client = new SendGridClient(_settings.Value.ApiKey);
            var msg = new SendGridMessage
            {
                From = new EmailAddress("info@afitapp.com", _settings.Value.User),
                Subject = emailSubject,
                PlainTextContent = message,
                HtmlContent = message
            };

            msg.AddTo(new EmailAddress(userEmail));
            msg.SetClickTracking(false, false);

            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

            Console.WriteLine(response.StatusCode);
        }
    }
}
