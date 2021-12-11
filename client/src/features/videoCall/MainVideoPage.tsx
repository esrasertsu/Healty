import { observer } from "mobx-react-lite";
import React,{ useState } from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import ChannelForm from "./ChannelForm";
import VideoCall from "./VideoCall";

const MainVideoPage :React.FC<RouteComponentProps>= () => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");

    return (
      <Container className="pageContainer">
        <div className="welcomeVideoPage">
        {inCall ? (
          <VideoCall setInCall={setInCall} channelName={channelName} />
        ) : (
          <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
        )}
        </div>
    
      </Container>
    );
  };
  

  export default observer(MainVideoPage)