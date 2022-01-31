import React, { Fragment, useContext } from 'react'
import {  Button, Comment } from 'semantic-ui-react'
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
  const {profile} = rootStore.profileStore;
  const {user} = rootStore.userStore;


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
                         style={!comment.allowDisplayName ? {pointerEvents: "none", color:"black"} : {color:"#263a5e"}}
                        replace>{!comment.allowDisplayName ? comment.displayName.charAt(0) + comment.displayName.split('').map((char: any) => "*" ).join("") : comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(new Date(comment.createdAt), new Date(),{locale: tr})}</div>
                        </Comment.Metadata>
                        <Comment.Metadata style={{display:"flex", justifyContent:"flex-end"}}>
                        {
                          (comment.star > 0) &&  <StarRating rating={comment.star} editing={false} key={comment.id} size="small" count={comment.starCount} showCount={false}/>
                        }
                        </Comment.Metadata>
                        <Comment.Text>{comment.body}</Comment.Text>
                      </Comment.Content>
                      </Comment>
                      </Fragment>
                 ))}
               </Comment.Group>
}
<div>
<Button
                 floated="right"
                 content="Daha fazla yorum..." 
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
                      className='blue-gradientBtn'
                      primary
                      circular
                      onClick={()=>openModal("Leave a comment",<ProfileCommentForm closeModal={closeModal} />,false,null)}
                    />)
                }
</div>
             
      </Fragment>
    
  );
};

export default observer(ProfileCommentList)