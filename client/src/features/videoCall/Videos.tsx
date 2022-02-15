import React,{ useState } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { observer } from "mobx-react-lite";

interface IProps{
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}

const Videos:React.FC<IProps> = ({ users, tracks}) => {
  
    return (
      <div>
        <div id="videos">
          <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} style={{height: '100%', width: '100%'}} />
          {users.length > 0 &&
            users.map((user) => {
              if (user.videoTrack) {
                return (
                  <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{height: '100%', width: '100%'}} key={user.uid} />
                );
              } else return null;
            })
            }
        </div>
      </div>
    );
  };

  export default observer(Videos);