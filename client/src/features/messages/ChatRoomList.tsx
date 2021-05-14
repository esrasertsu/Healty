import React, {useContext, useEffect} from 'react';
import { Grid, Image, List } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { format } from 'date-fns';


const ChatRoomList: React.FC = () => {
debugger;
    const rootStore = useContext(RootStoreContext);
    const {loadingMessages, chatRooms } = rootStore.messageStore;


    if(loadingMessages) return <LoadingComponent content='Loading chat rooms...'/>  

    return (
      <>
    <List divided verticalAlign='middle'>
      {chatRooms!.map((room)=>(
        <List.Item>
        <List.Content floated='right'>
          <span>{format(new Date(room.lastMessageDate), 'eeee do MMMM')}</span>
        </List.Content>
        <Image avatar src={room.userImage} />
        <List.Content>{room.userName}</List.Content>
    </List.Item>
      ))}
      
    
  </List>
      </>
    )
}

export default observer(ChatRoomList)