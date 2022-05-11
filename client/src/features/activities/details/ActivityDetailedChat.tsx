import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { Link } from 'react-router-dom';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import { IComment } from '../../../app/models/activity';

 const ActivityDetailedChat = () => {

  const rootStore = useContext(RootStoreContext);

  const [sortedMessages, setSortedMessages] = useState<IComment[]>([])

  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);
    return () => {
      stopHubConnection();
    }
  }, [createHubConnection, stopHubConnection,activity])


  useEffect(() => {

    if(activity && activity.comments)
    {
       setSortedMessages(activity.comments.slice().sort(
      (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))}
   
  }, [activity,activity!.comments.length])
 

    return (
           <div style={{marginTop:"50px"}}>
            <Header>Grup Mesajları</Header>
           
             <Segment attached style={{maxHeight:"400px", overflowY:"scroll", display:"flex", flexDirection:"column-reverse"}}>
               <Comment.Group>
                 {sortedMessages.map((comment) => (
                      <Comment key={comment.id}>
                      <Comment.Avatar src={comment.image || '/assets/user.png'}  onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}} />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${comment.username}`} replace>{comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.body}</Comment.Text>
                        {/* <Comment.Actions>
                          <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions> */}
                      </Comment.Content>
                      </Comment>
                 ))}
                    </Comment.Group>
             </Segment>
                 <Segment attached>

                
                <FinalForm 
                  onSubmit ={addComment}
                  render={({handleSubmit, submitting, form}) => (
                    <Form onSubmit={() => handleSubmit()!.then(()=> form.reset())}>
                    <Field 
                    name='body'
                    component={TextAreaInput}
                    rows={2}
                    placeholder='Add your comment' 
                    />
                    <Button
                      circular
                      content='Gönder'
                      labelPosition='left'
                      icon='edit'
                      className='blueBtn'
                      loading={submitting}
                    />
                  </Form>
                  )}
                />
       
       </Segment>
                 
            
           </div>
    )
}

export default observer(ActivityDetailedChat);