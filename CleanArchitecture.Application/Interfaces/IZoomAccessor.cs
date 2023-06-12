namespace CleanArchitecture.Application.Interfaces
{
    public interface IZoomAccessor
    {
        string GenerateToken(string meetingNumber, string ts, string role);

    }

}
