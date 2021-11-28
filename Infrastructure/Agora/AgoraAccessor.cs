using CleanArchitecture.Application.Agora;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using Infrastructure.Agora.Media;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Infrastructure.Agora
{
    public class AgoraAccessor : IAgoraAccessor
    {

        public string ApiID = "";
        public string ApiCert = "";
        public AgoraAccessor(IOptions<AgoraSettings> config)
        {
            ApiID = config.Value.ApiID;
            ApiCert = config.Value.ApiCert;

        }

        public string GenerateToken(string channelName, uint uid, uint expiredTs)
        {


            if (string.IsNullOrEmpty(ApiID) || string.IsNullOrEmpty(ApiCert))
                throw new RestException(HttpStatusCode.NotFound, new { NotFound = "AppId / Cert NotFound" });

            var tokenBuilder = new AccessToken(ApiID, ApiCert, channelName, uid.ToString());

            tokenBuilder.addPrivilege(Privileges.kJoinChannel, expiredTs);

            tokenBuilder.addPrivilege(Privileges.kPublishAudioStream, expiredTs);

            tokenBuilder.addPrivilege(Privileges.kPublishVideoStream, expiredTs);

            tokenBuilder.addPrivilege(Privileges.kPublishDataStream, expiredTs);

            tokenBuilder.addPrivilege(Privileges.kRtmLogin, expiredTs);


            return tokenBuilder.build();
        }
    }
}
