import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import MessageChat from './MessageChat';
import ChatRoomList from './ChatRoomList';
import Scrollbars from 'react-custom-scrollbars';
import { useMediaQuery } from 'react-responsive'


const MessagesPage: React.FC = () => {

    const rootStore = useStore();
    const { loadingChatRooms, loadChatRooms , chatRoomId, setChatRoomId} = rootStore.messageStore;
    const { hubConnection,createHubConnection} = rootStore.userStore;
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const [showChatRoomList, setshowChatRoomList] = useState(true);

    useEffect(() => {
        hubConnection === null ? 
        createHubConnection(true).then(()=>{
        loadChatRooms()
         }): 
         loadChatRooms()
         return () => {
            setChatRoomId(null);
        }
    }, [createHubConnection,hubConnection,loadChatRooms,setChatRoomId]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingChatRooms) return <LoadingComponent content='Loading messages...'/>  

    return (
        <Container className="pageContainer">

        <div className="inbox-wrapper" >
        <Grid stackable className="inbox-grid">
        {showChatRoomList &&  <Grid.Column width="6" >
          <ChatRoomList setshowChatRoomList={setshowChatRoomList}/>
          </Grid.Column>
        }
         {!isMobile &&
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
                     <MessageChat setshowChatRoomList={setshowChatRoomList}/>
         }
          </Grid.Column>
        }


        {
            isMobile && !showChatRoomList &&
            <Grid.Column width="10"className="messageChat_grid">
            {
               <MessageChat setshowChatRoomList={setshowChatRoomList}/>
            }
            </Grid.Column>
        }
         </Grid>
        </div>
       
     </Container>
    )
}

export default observer(MessagesPage)