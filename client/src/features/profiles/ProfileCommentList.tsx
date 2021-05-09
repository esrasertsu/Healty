import React, { Fragment, useContext } from 'react'
import {  Button, Comment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { StarRating } from '../../app/common/form/StarRating';
import ProfileCommentForm from './ProfileCommentForm';


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


  return (
<Fragment>
{getCommentsByDate.length === 0 ? 
              <p>
Eğitmen hakkında ilk yorumu sen yap!
              </p>  :
    <Comment.Group style={{maxWidth: "100%"}}>
                 {getCommentsByDate.map((comment) => (
                     <Fragment key={comment.id}>
                      <Comment key={comment.id}>
                      <Comment.Avatar circular src={comment.image || '/assets/user.png'} />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${comment.authorName}`} replace>{comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
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
               <Button
                 floated="right"
                 content="More..." 
                 positive
                 onClick={handleGetNext}
                 style={totalPages === 0 ? {display:"none"}: {display:"inline"}}
                 disabled={totalPages === commentPage + 1 || totalPages === 0}
                 loading={loadingNext}/>
                  <Button
                      content='Comment'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={()=>openModal("Leave a comment",<ProfileCommentForm closeModal={closeModal} />)}
                    />
      </Fragment>
    
  );
};

export default observer(ProfileCommentList)