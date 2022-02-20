import React, { Fragment, useContext } from 'react'
import {  Button, Comment, Icon } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { StarRating } from '../../app/common/form/StarRating';
import ProfileCommentForm from './ProfileCommentForm';
import tr  from 'date-fns/locale/tr'

interface IProps {
  handleGetNext: () => void;
  totalPages: number;
  loadingNext: boolean;
  commentPage:number;
  getCommentsByDate: any[]
}

const ProfileCommentList: React.FC<IProps> = ({handleGetNext,totalPages,commentPage,loadingNext,getCommentsByDate}) => {

  const rootStore = useContext(RootStoreContext);
  const {openModal, closeModal} = rootStore.modalStore;
  const {profile, deleteComment,reportComment} = rootStore.profileStore;
  const {user,isLoggedIn} = rootStore.userStore;

  const handleDeleteComment = (id:string) =>{
    deleteComment(id)
  }

  const handleReportComment = (id:string) =>{
    reportComment(id)
  }

  return (
<Fragment>
{getCommentsByDate.length === 0 ? 
              <p style={{fontSize:"16px"}}>
                Eğitmen hakkında henüz yorum yapılmamış.
              </p>  :
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
                        <Comment.Action onClick={() => handleReportComment(comment.id)}>
                          <Icon name="info circle" />
                          Şikayet Et
                        </Comment.Action>
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
                      onClick={()=>
                        openModal("Leave a comment",
                        <ProfileCommentForm closeModal={closeModal} />,false,null,undefined, true)}
                    />)
                }
</div>
             
      </Fragment>
    
  );
};

export default observer(ProfileCommentList)