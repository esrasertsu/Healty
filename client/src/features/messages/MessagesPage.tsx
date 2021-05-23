import React, {useContext, useEffect} from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import MessageChat from './MessageChat';
import ChatRoomList from './ChatRoomList';


const MessagesPage: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadingChatRooms, loadChatRooms } = rootStore.messageStore;

    useEffect(() => {
        loadChatRooms();
    }, [loadChatRooms]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingChatRooms) return <LoadingComponent content='Loading messages...'/>  

    return (
        <div className="inbox-wrapper" >
        <Grid stackable className="inbox-grid">
          <Grid.Column width="6" >
           <ChatRoomList />
          </Grid.Column>
          <Grid.Column width="10"className="messageChat_grid">
           <MessageChat />
          </Grid.Column>
         </Grid>
        </div>
       
     
    )
}

export default observer(MessagesPage)