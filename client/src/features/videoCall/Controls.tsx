import React,{ useState } from "react";
import { createClient } from "agora-rtc-react";
import { ClientConfig, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { runInAction } from "mobx";

const config:ClientConfig = {mode: "rtc", codec: "vp8"}
const useClient = createClient(config);

export const Controls = (props: {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    setUsers:React.Dispatch<React.SetStateAction<IAgoraRTCRemoteUser[]>>;
  }) => {
    const client = useClient();
    const { tracks, setStart, setInCall,setUsers } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });
  
    const mute = async (type: "audio" | "video") => {
      if (type === "audio") {
        await tracks[0].setEnabled(!trackState.audio);
        setTrackState((ps) => {
          return { ...ps, audio: !ps.audio };
        });
      } else if (type === "video") {
        await tracks[1].setEnabled(!trackState.video);
        setTrackState((ps) => {
          return { ...ps, video: !ps.video };
        });
      }
    };
  
    const leaveChannel = async () => {
     
      tracks[0].close();
      tracks[1].close();
     const a = await client.leave();
     runInAction(() =>{
      client.removeAllListeners();
      setUsers([])
      setStart(false);
      setInCall(false);
     })
      
    };
  
    return (
      <div className="controls">
        <p className={trackState.audio ? "on" : "off"}
          onClick={() => mute("audio")}>
          {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
        </p>
        <p className={trackState.video ? "on" : "off"}
          onClick={() => mute("video")}>
          {trackState.video ? "MuteVideo" : "UnmuteVideo"}
        </p>
        {<p onClick={() => leaveChannel()}>Leave</p>}
      </div>
    );
  };