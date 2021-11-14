using System.Threading.Tasks;

namespace CleanArchitecture.Application.Interfaces
{
    public interface ISmsSender
    {
        Task<bool> SendSmsAsync(string phoneNumber);
        Task<bool> VerifySmsAsync(string phoneNumber, string code);

    }
}
