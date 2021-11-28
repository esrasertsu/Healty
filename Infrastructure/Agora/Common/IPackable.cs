

namespace Infrastructure.Agora.Common
{
    public interface IPackable
    {
        ByteBuf marshal(ByteBuf outBuf);
    }
}
