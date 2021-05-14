import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import MessageChat from './MessageChat';
import ChatRoomList from './ChatRoomList';


const MessagesPage: React.FC = () => {
debugger;
    const rootStore = useContext(RootStoreContext);
    const { loadingChatRooms, loadChatRooms } = rootStore.messageStore;

    useEffect(() => {
        loadChatRooms();
        debugger;
    }, [loadChatRooms]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingChatRooms) return <LoadingComponent content='Loading messages...'/>  

    return (
      <Grid>
          <Grid.Column width="6">
           <ChatRoomList />
          </Grid.Column>
          <Grid.Column width="10">
           <MessageChat />
          </Grid.Column>
      </Grid>
    )
}

export default observer(MessagesPage)