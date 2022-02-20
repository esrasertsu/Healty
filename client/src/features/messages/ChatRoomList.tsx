import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Button, Container, Icon, Image, List, Popup, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { format } from 'date-fns';
import Scrollbars from 'react-custom-scrollbars';
import tr  from 'date-fns/locale/tr';
import { useMediaQuery } from 'react-responsive'
import { history } from '../..';

const styles = {
  color:"#000"
}

interface IProps{
  setshowChatRoomList:(value:boolean) => void;
}

const ChatRoomList: React.FC<IProps> = ({setshowChatRoomList}) => {

    const rootStore = useContext(RootStoreContext);
    const {loadingChatRooms, chatRooms,chatRoomId,setChatRoomId } = rootStore.messageStore;
    const [activeChatRoomIndex, setActiveChatRoomIndex] = useState<string|null>(null)
    const {onlineUsers} = rootStore.userStore;
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

    useEffect(() => {
      setActiveChatRoomIndex(chatRoomId);
      return () => {
       setActiveChatRoomIndex(null);
      }
    },[chatRoomId])

    const handleChatRoomClick = (e:any, id:any) => {
          setChatRoomId(id);
          setActiveChatRoomIndex(id);
          if(isMobile)
            setshowChatRoomList(false);
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
            {chatRooms && chatRooms.length>0 ? chatRooms.map((room)=>(
              <List.Item
              key={room.id}
              style={room.unReadMessageCount>0 ? styles : null}
              className="messagePage_listItem"
              active={activeChatRoomIndex===room.id}
              onClick={(e) => handleChatRoomClick(e,room.id)}
              >
              <List.Content floated='right'>
                <span>{format(new Date(room.lastMessageDate), 'dd LLL, eeee',{locale: tr})}</span>
              </List.Content>
              <List.Content floated='left' className="messagePage_listItem_Content">
              <Popup
              header={room.unReadMessageCount +" okunmamış mesaj"}
              className="popup"
              position="left center"
              trigger={
               <> <Image
                  size="mini"
                  circular
                  avatar
                  src={room.userImage  || '/assets/user.png'}
                  bordered = {room.unReadMessageCount === 0 ? true : false}
                  className="messagePage_listItem_image"
                >
                </Image>
                <Icon name="circle" className="onlineSymbol" color={onlineUsers.indexOf(room.userName) > -1 ? "green": "grey"} />

                </>
              }
            />
              <List.Content>
                <List.Header>{room.displayName}</List.Header>
                <span>{room.lastMessage && room.lastMessage.length > 50 ? room.lastMessage.substring(0, 50) + "..." : room.lastMessage}</span>
                </List.Content>
              </List.Content>
          </List.Item>
      ))
      : 
      <List.Item active={true} style={{display:"flex", justifyContent:"center", alignItems:"center",textAlign:"center", flexDirection:"column"}}>
        <p style={{ marginTop:"20px"}}>Henüz iletişime geçtiğin bir uzman bulunamadı.</p>
        <Button style={{ marginBottom:"20px"}} className='blueBtn' circular content="Uzmanları Göster" onClick={()=> history.push('/profiles')} />
      </List.Item>
      }
  </List>
             </Scrollbars>
             </Segment>
      </Fragment>
  
    )
}

export default observer(ChatRoomList)