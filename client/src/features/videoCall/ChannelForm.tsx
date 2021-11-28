import React, { Fragment, useContext, useEffect, useState } from 'react'
import { observer } from "mobx-react-lite";

const ChannelForm = (props: {
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    setChannelName: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { setInCall, setChannelName } = props;
  
    return (
      <form className="join">
        {process.env.REACT_APP_AGORA_APP_ID === '' && <p style={{color: 'red'}}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
        <input type="text"
          placeholder="Enter Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={(e) => {
          e.preventDefault();
          setInCall(true);
        }}>
          Join
        </button>
      </form>
    );
  };

  export default observer(ChannelForm)