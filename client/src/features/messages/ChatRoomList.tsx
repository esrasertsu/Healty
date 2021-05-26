import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Grid, Icon, Image, List, Popup, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { format } from 'date-fns';
import Scrollbars from 'react-custom-scrollbars';

const styles = {
  color:"#000"
}
const ChatRoomList: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingChatRooms, chatRooms,chatRoomId,setChatRoomId } = rootStore.messageStore;
    const [activeChatRoomIndex, setActiveChatRoomIndex] = useState<string|null>(null)

    useEffect(() => {
      setActiveChatRoomIndex(chatRoomId);
      return () => {
       setActiveChatRoomIndex(null);
      }
    })

    const handleChatRoomClick = (e:any, id:any) => {
          setChatRoomId(id);
          setActiveChatRoomIndex(id);
    }

    if(loadingChatRooms) return <LoadingComponent content='Loading chat rooms...'/>  

    return (
      <Fragment>
       <Segment secondary attached style={{ border: 'none', height:"100%"}}>
            <Scrollbars
             frameBorder="2px" 
             className="messagePage_scrollbar"
        
             >
                <List selection divided verticalAlign='middle'>
            {chatRooms!.map((room)=>(
              <List.Item
              key={room.id}
              style={room.unReadMessageCount>0 ? styles : null}
              className="messagePage_listItem"
              active={activeChatRoomIndex===room.id}
              onClick={(e) => handleChatRoomClick(e,room.id)}
              >
              <List.Content floated='right'>
                <span>{format(new Date(room.lastMessageDate), 'eeee do MMMM')}</span>
              </List.Content>
              <List.Content floated='left' className="messagePage_listItem_Content">
              <Popup
              header={room.unReadMessageCount +" okunmamış mesaj"}
              className="popup"
              position="left center"
              trigger={
                <Image
                  size="mini"
                  circular
                  avatar
                  src={room.userImage  || '/assets/user.png'}
                  bordered = {room.unReadMessageCount === 0 ? true : false}
                  className="messagePage_listItem_image"
                />
              }
            />
              <List.Content>
                <List.Header>{room.userName}</List.Header>
                <span>{room.lastMessage.length > 50 ? room.lastMessage.substring(0, 50) + "..." : room.lastMessage}</span>
                </List.Content>
              </List.Content>
          </List.Item>
      ))}
  </List>
             </Scrollbars>
             </Segment>
      </Fragment>
    )
}

export default observer(ChatRoomList)