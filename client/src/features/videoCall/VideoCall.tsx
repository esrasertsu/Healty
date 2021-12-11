import React, { useContext, useEffect, useState } from "react";
import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
  } from "agora-rtc-react";
import Videos from "./Videos";
import { Controls } from "./Controls";
import { RouteComponentProps } from "react-router";
import agent from "../../app/api/agent";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { action } from "mobx";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";

const config:ClientConfig = {mode: "rtc", codec: "vp8"}

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall  = (props: {
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    channelName: string;
  }) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [start, setStart] = useState<boolean>(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const rootStore = useContext(RootStoreContext);
    const { generateAgoraToken } = rootStore.activityStore;
    const footer = document.getElementById("footer");
    if(footer) footer.hidden = true;

    useEffect(() => {
        // function to initialise the SDK
        let init = async (name: string) => {
          console.log("init", name);
          client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            console.log("subscribe success");
            if (mediaType === "video") {
              setUsers((prevUsers) => {
                return [...prevUsers, user];
              });
            }
            if (mediaType === "audio") {
              user.audioTrack!.play();
            }
          });
    
          client.on("user-unpublished", (user, type) => {
            console.log("unpublished", user, type);
            if (type === "audio") {
              user.audioTrack!.stop();
            }
            if (type === "video") {
              setUsers((prevUsers) => {
                return prevUsers.filter((User) => User.uid !== user.uid);
              });
            }
          });
    
          client.on("user-left", (user) => {
            console.log("leaving", user);
                user.audioTrack && user.audioTrack.stop();
              
              
            setStart(false);
            setInCall(false);
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
            
          });
           
          generateAgoraToken(name)
            .then(async(response) => {
                debugger;
                if(response!== "")
                {
                    try {
                        await client.join(process.env.REACT_APP_AGORA_APP_ID as string, name, response, null);
                        if (tracks) await client.publish([tracks[0], tracks[1]]);
                        setStart(true);
                    } catch (error) {
                        toast.error("Lütfen tekrar deneyiniz.")
                        console.log(error);
                        await client.leave();
                        client.removeAllListeners();
                        if (tracks){
                            tracks[0].close();
                            tracks[1].close();
                        }
                        setUsers((prevUsers) => {
                            return prevUsers.filter((User) => User.uid !== client.uid);
                          });
                          
                        setStart(false);
                        setInCall(false);
                    }
                   
                }else{
                    await client.leave();
                    client.removeAllListeners();
                    if (tracks){
                        tracks[0].close();
                        tracks[1].close();
                    }
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== client.uid);
                      });
                      
                    setStart(false);
                    setInCall(false);
                }
                
            })


            client.on("token-privilege-will-expire", async () => {
              debugger;
                generateAgoraToken(name)
                .then(async(response) => {
                 const data =  JSON.parse(response);
                        client.renewToken(data.token);
                    
                })
            })
          
    
        };
    
        if (ready && tracks) {
          console.log("init ready");
          init(channelName);
        }

        return() =>{
          const footer = document.getElementById("footer");
         if(footer) footer.hidden = false;
        }
    
      }, [channelName, client, ready, tracks]);


      return (
        <div className="App">
          {/* {ready && tracks && (
            <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
          )}
          {start && tracks && <Videos users={users} tracks={tracks} />} */}

          {ready && tracks && start && (
            <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} setUsers={setUsers} />
          )}
          {start && tracks && <Videos users={users} tracks={tracks} />}
          {!ready && !tracks && !start && (
            <LoadingComponent content="Bağlanıyor.." />
          )}
        </div>
      );
};


export default observer(VideoCall)