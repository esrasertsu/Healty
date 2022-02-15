import { observer } from "mobx-react-lite";
import React,{ useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../app/stores/rootStore";
import ChannelForm from "./ChannelForm";
import VideoCall from "./VideoCall";

interface DetailParams{
  id:string
}

const MainVideoPage :React.FC<RouteComponentProps<DetailParams>>= ({match, history}) => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");

    const rootStore = useContext(RootStoreContext);
    const { activity, loadActivity, loadingActivity,updateActivityChannel } = rootStore.activityStore;
    const { user } = rootStore.userStore;

  useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id, history])
    
    useEffect(() => {
      if(inCall && channelName!=="" && activity && activity.isHost)
      {
        updateActivityChannel(activity.id,channelName)
      }
    }, [inCall,channelName]);
    
    if(loadingActivity) return <LoadingComponent content='Loading...'/>  

    return (
      <Container className="pageContainer">
        <div className="welcomeVideoPage">
        { 
          inCall ? (
          <VideoCall setInCall={setInCall} channelName={channelName} activityId={match.params.id}/>
        ) : (
          <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
        )
   
      }
        </div>
    
      </Container>
    );
  };
  

  export default observer(MainVideoPage)