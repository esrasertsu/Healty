import React, { Fragment, useContext } from 'react'
import {  Comment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

const ProfileCommentList: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { getCommentsByDate } = rootStore.profileStore;

  return (
<Fragment>
    <Comment.Group style={{maxWidth: "100%"}}>
                 {getCommentsByDate.map((comment) => (
                     <Fragment key={comment.id}>
                      <Comment key={comment.id}>
                      <Comment.Avatar src={comment.image || '/assets/user.png'} />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${comment.authorName}`} replace>{comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.body}</Comment.Text>
                      </Comment.Content>
                      </Comment>
                      </Fragment>
                 ))}
               </Comment.Group>
      </Fragment>
    
  );
};

export default observer(ProfileCommentList)