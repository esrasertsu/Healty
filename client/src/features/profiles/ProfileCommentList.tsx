import React, { Fragment, useContext, useState } from 'react'
import {  Button, Comment, Form, Icon, TextArea } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import { useStore } from '../../app/stores/rootStore';
import { format, formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { StarRating } from '../../app/common/form/StarRating';
import ProfileCommentForm from './ProfileCommentForm';
import tr  from 'date-fns/locale/tr'
import { IProfileComment } from '../../app/models/profile';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { Form as FinalForm , Field } from 'react-final-form';
import { useMediaQuery } from 'react-responsive';
interface IProps {
  handleGetNext: () => void;
  totalPages: number;
  loadingNext: boolean;
  commentPage:number;
  getCommentsByDate: IProfileComment[]
}

const ProfileCommentList: React.FC<IProps> = ({handleGetNext,totalPages,commentPage,loadingNext,getCommentsByDate}) => {

  const rootStore = useStore();
  const {openModal, closeModal} = rootStore.modalStore;
  const {profile, deleteComment,reportComment} = rootStore.profileStore;
  const {user,isLoggedIn} = rootStore.userStore;
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleDeleteComment = (id:string) =>{
    deleteComment(id)
  }

 
  const handleReportComment = (id:string) =>{

    openModal("",
    <FinalForm
    onSubmit ={handleSendReport}
    initialValues={{ body:"", id:id }}
    render={({handleSubmit, submitting, form}) => (
      <Form widths={"equal"} 
      onSubmit={() => handleSubmit()!.then(()=> {form.reset(); closeModal();})}
      >
       <Field
              name="body"
              placeholder="Şikayet sebebinizi belirtiniz"
              component={TextAreaInput}
              rows={6}
            />  
      <br/>


        <Button loading={submitting} floated='right' circular type="submit" color='green'>
          <Icon name='checkmark' /> Gönder
        </Button>
        <Button floated='right' circular color='red' onClick={(e) => {e.preventDefault();closeModal();}}>
          <Icon name='remove' /> İptal
        </Button>
    </Form>
    
    )}
  />
    ,false,
    null
       ,undefined, true, "tiny")
  }

const handleSendReport = async (data:any) =>{
  if(data.body!=="" && data.body!==null && data.body.length>5 && data.id !== null)
     reportComment(data.id,data.body)
}

  return (
<Fragment>
{getCommentsByDate.length === 0 ? 
              <div className='notFoundText'>
                Eğitmen hakkında henüz yorum yapılmamış.
            </div>:
    <Comment.Group style={{maxWidth: "100%"}}>
                 {getCommentsByDate.map((comment) => (
                     <Fragment key={comment.id}>
                      <Comment key={comment.id}>
                      <Comment.Avatar circular="true" src={comment.image || '/assets/user.png'}  onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}/>
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${comment.authorName}`} 
                         style={!comment.allowDisplayName ? {pointerEvents: "none", color:"black"} : {color:"#222E50"}}
                        replace>{!comment.allowDisplayName ? comment.displayName.charAt(0) + comment.displayName.split('').map((char: any) => "*" ).join("") : comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(new Date(comment.createdAt), new Date(),{locale: tr})}</div>
                        </Comment.Metadata>
                        <Comment.Metadata style={{float:"right"}} >
                        {
                          (comment.star > 0) &&  <StarRating rating={comment.star} editing={false} key={comment.id} size="small" count={comment.starCount} showCount={false}/>
                        }
                        </Comment.Metadata>
                        <Comment.Text>{comment.body}</Comment.Text>
                        <Comment.Actions>

                        {isLoggedIn && user!.userName === comment.authorName && 
                        <Comment.Action onClick={() => handleDeleteComment(comment.id)}>
                          <Icon name="trash alternate outline" />
                          Sil
                        </Comment.Action>}
                        {isLoggedIn && user!.userName !== comment.authorName && 

                        (!comment.isReported  ?
                          <Comment.Action onClick={() => handleReportComment(comment.id)}>
                            <Icon name="info circle" />
                            Şikayet Et
                          </Comment.Action>
                          :
                          <Comment.Action>
                            <Icon color="red" name="info circle" />
                           <span>Şikayetiniz iletildi!</span>
                          </Comment.Action>
                        )
                        
                        }
                        </Comment.Actions>
                      </Comment.Content>
                      </Comment>
                      </Fragment>
                 ))}
               </Comment.Group>
}
<div style={{marginTop:"30px"}}>
<Button
                 floated="right"
                 content="Daha fazlasını gör..." 
                 positive
                 circular
                 onClick={handleGetNext}
                 style={totalPages === 0 ? {display:"none"}: {display:"inline"}}
                 disabled={totalPages === commentPage + 1 || totalPages === 0}
                 loading={loadingNext}/>
                 
               {user && profile!.userName !== user.userName &&
               (
                  <Button
                      content='Yorum yaz'
                      labelPosition='left'
                      icon='edit'
                      className='blueBtn'
                      primary
                      circular
                      fluid={isMobile}
                      onClick={()=>
                        openModal("Leave a comment",
                        <ProfileCommentForm closeModal={closeModal} />,false,null
                        ,undefined, true, "small")}
                    />)
                }
</div>
             
      </Fragment>
    
  );
};

export default observer(ProfileCommentList)