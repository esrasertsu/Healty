import React, {Fragment, useContext, useEffect} from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import MessageChat from './MessageChat';
import ChatRoomList from './ChatRoomList';
import Scrollbars from 'react-custom-scrollbars';


const MessagesPage: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadingChatRooms, loadChatRooms , chatRoomId} = rootStore.messageStore;
    const { hubConnection,createHubConnection} = rootStore.userStore;

    useEffect(() => {
        hubConnection === null ? 
        createHubConnection().then(()=>{
        loadChatRooms()
         }): 
         loadChatRooms()
    }, [loadChatRooms]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingChatRooms) return <LoadingComponent content='Loading messages...'/>  

    return (
        <div className="inbox-wrapper" >
        <Grid stackable className="inbox-grid">
          <Grid.Column width="6" >
           <ChatRoomList />
          </Grid.Column>
          <Grid.Column width="10"className="messageChat_grid">
          {
                     chatRoomId === null ? (
                        <Fragment>
                        <Segment className="chat_segment">
                            <div className="chat_reading_box">
                            <Scrollbars
                         frameBorder="2px" 
                         className="messagePage_scrollbar"
                         >
                                <div className="emptyMessageBox"><h3>Mesajlaşmaya başlamak için birini seçin...</h3></div>
                             </Scrollbars>
                             </div>
                             </Segment>
                             </Fragment>

                     )  : 
                     <MessageChat/>
         }
          </Grid.Column>
         </Grid>
        </div>
       
     
    )
}

export default observer(MessagesPage)