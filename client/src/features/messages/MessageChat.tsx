import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Button, Container, Form, Grid, Item, Label, Loader, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { format } from 'date-fns';
import { Form as FinalForm, Field} from 'react-final-form';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import InfiniteScroll from 'react-infinite-scroller';
import Scrollbars from 'react-custom-scrollbars';

const MessageChat: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { messagesByDate, message,messageCount,setPage,loadMessages ,page, totalPages ,chatRoomId,addComment} = rootStore.messageStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const { user } = rootStore.userStore;
    const scrollRef = React.createRef<any>();
    const [top, setTop] = useState(0);
    const [handledGetNext, sethandledGetNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page +1);
        loadMessages(chatRoomId!).then(() => {
            setLoadingNext(false)
            sethandledGetNext(true)
        })
      }
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


        const scrollToTop = () => {
            scrollRef.current.scrollTo(0, top-50);
        };

        const handleScroll = (e:any) => {
            if(loadingNext)
            {
                setTop(e.target.scrollTop);
            }
       
        };


    return (
        <Fragment>
            <Segment className="chat_segment">
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
                           <Label size='tiny' style={{marginTop:"10px"}}>
                           {format(new Date(group), 'eeee do MMMM')}
                           </Label>
                       </div>
                       <Item.Group key={group + "_message"}>
                       {messages.map((message) => (
                           <Item key={message.id} className={message.username === user!.userName ? "currentUserMessage": "otherUserMessage" }>
                               <Item.Image size='mini' style={{ height: "100%"}} circular src={message.image} />
                               <Item.Content className={message.username === user!.userName ? "currentUserMessage_content": "otherUserMessage_content" } verticalAlign='middle'>
                                   {message.body}
                                   <Item.Extra>
                              <div>{format(message.createdAt, 'h:mm a')}</div>
   
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
            </div>
           
        </Fragment>
    )
}

export default observer(MessageChat)