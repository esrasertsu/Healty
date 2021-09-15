import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Button, Form, Icon, Item, Label, Loader, Popup, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { Form as FinalForm, Field} from 'react-final-form';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import InfiniteScroll from 'react-infinite-scroller';
import Scrollbars from 'react-custom-scrollbars';
import { history } from '../..';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'

interface IProps{
    setshowChatRoomList:(value:boolean) => void;
  }
const MessageChat: React.FC<IProps> = ({setshowChatRoomList}) => {
    const rootStore = useContext(RootStoreContext);
    const { messagesByDate, setPage,loadMessages ,page, totalPages ,chatRoomId,addComment, chatRooms} = rootStore.messageStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const { user } = rootStore.userStore;
    const scrollRef = React.createRef<any>();
    const [top, setTop] = useState(0);
    const [handledGetNext, sethandledGetNext] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page +1);
        loadMessages(chatRoomId!).then(() => {
            setLoadingNext(false)
            sethandledGetNext(true)
        })
      }
    


        const scrollToTop = () => {
            scrollRef.current.scrollTo(0, top-50);
        };

        const handleScroll = (e:any) => {
            if(loadingNext)
            {
                setTop(e.target.scrollTop);
            }
       
        };

        useEffect(() => {
            if (handledGetNext) {
              scrollToTop();
            }
            else{
                setTop(50);
            }
          
            return () => {
                sethandledGetNext(false);
            }
            }, [messagesByDate]);


    return (
        <>
        <Fragment>
            <Segment className="chat_segment">
            <div className="chat_profile_details">{
          chatRooms &&
          <Item.Group key={"seeUserProfile_itemGroup"} className="chat_messageitems">
            <Item style={{alignItems:"center"}} key="seeUserProfile" onClick={() => history.push(`/profile/${chatRooms.filter(x => x.id === chatRoomId)[0].userName}`)}>
                <Item.Image className="chat_images" size="mini" circular src={chatRooms.filter(x => x.id === chatRoomId)[0].userImage || '/assets/user.png'} />
          
                <Item.Content>
                  <Item.Header>{chatRooms.filter(x => x.id === chatRoomId)[0].displayName} profilini görmek için tıkla</Item.Header>
             </Item.Content>
             </Item>
             </Item.Group>
            }</div>

                <div className="chat_reading_box">
                <Scrollbars
             frameBorder="2px" 
             className="messagePage_scrollbar"
             >
                 <Loader active={loadingNext}/>
                 {
                    <div
                    onScroll={handleScroll}
                    ref={scrollRef}
                   style={{
                       height: "100%",
                       overflow: 'auto',
                       display: 'flex',
                       flexDirection: 'column-reverse',
                   }}
                   > 
                   <InfiniteScroll
                   pageStart={0}
                   loadMore={handleGetNext}
                   hasMore={!loadingNext && page +1 < totalPages}
                   style={{ margin: "10px"}} 
                   initialLoad={false}
                   isReverse={true}                 
                   getScrollParent={()=>document.getElementById('scrollableDiv')} 
                   useWindow={false}
                   target="scrollableDiv"
                 >
                   {
                   messagesByDate.map(([group, messages]) =>(
                   <div key={group}>
                       <div className="chatLabels">
                           <Label size='small' style={{marginTop:"10px"}}>
                           {format(new Date(group), 'dd MMMM yyyy, eeee',{locale: tr})}
                           </Label>
                       </div>
                       <Item.Group key={group + "_message"} >
                       {messages.map((message) => (
                           <Item key={message.id} className={message.username === user!.userName ? "currentUserMessage": "otherUserMessage" }>
                               <Item.Image size='mini' className="chat_images" style={{height: "100%"}} circular src={message.image  || '/assets/user.png'} />
                               <Item.Content className={message.username === user!.userName ? "currentUserMessage_content": "otherUserMessage_content" } verticalAlign='middle'>
                                   {message.body}
                                   <Item.Extra>
                              <div>{format(message.createdAt, 'HH:mm') + " "}
                              {
                                  message.username === user!.userName &&
                                  message.seen && 
                                  <Popup
                                    header={"Okundu"}
                                    className="popup"
                                    position="right center"
                                    trigger={
                                        <Icon name="eye"></Icon>
                                    } />
                              }   
                              </div>
   
                              </Item.Extra>
                              </Item.Content>
                            
                           </Item>
                           ))}
                       </Item.Group>
                   </div>
   
                       ))}
                </InfiniteScroll></div>
                 }
                
           
             </Scrollbars>
                </div>
            </Segment>
            <div className="chat_message_box_segment">
            <div className="chat_message_box">
                <FinalForm 
                  onSubmit ={addComment}
                  render={({handleSubmit, submitting, form}) => (
                    <Form className="chat-text-form" onSubmit={() => handleSubmit()!.then(()=> form.reset())}>
                    <Field 
                    name='body'
                    component={TextAreaInput}
                    rows={2}
                    placeholder='Add your comment' 
                    className="chat_textarea"
                    />
                    <div>
                    <Button
                      content='Send'
                      primary
                      loading={submitting}
                      disabled={chatRoomId === null}
                    />
                    </div>
                   
                  </Form>
                  )}
                />

                </div>
                {isMobile &&  <Button fluid onClick={() => setshowChatRoomList(true)} content="Mesajlara dön.."/>} 

            </div>
        </Fragment>
        </>
    )
}

export default observer(MessageChat)