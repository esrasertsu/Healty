using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.User;
using Infrastructure.Security.ReCaptcha;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class GoogleReCAPTHAAccessor : IGoogleReCAPTCHAAccessor
    {
        private readonly IOptions<ReCAPTCHASettingsModel> _settings;

        public GoogleReCAPTHAAccessor(IOptions<ReCAPTCHASettingsModel> settings)
        {
            _settings = settings;
        }

        public virtual async Task<ReCAPTHAResponse> VerificateRecaptcha(string token)
        {
            ReCAPTHADataModel data = new ReCAPTHADataModel
            {
                Response = token,
                Secret = _settings.Value.SecretKey
            };

            HttpClient httpClient = new HttpClient();
            var response = await httpClient.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={data.Secret}&response={data.Response}");

            var reCapResponse = JsonConvert.DeserializeObject<ReCAPTHAResponse>(response);

            return reCapResponse;
        }

    }
}
