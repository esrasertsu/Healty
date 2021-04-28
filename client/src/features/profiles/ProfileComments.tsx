import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import ProfileCommentForm from './ProfileCommentForm';
import ProfileCommentList from './ProfileCommentList';

 const ProfileComments = () => {

  const rootStore = useContext(RootStoreContext);

  const {
    profile,
    loadComments,
    commentPage,
    setCommentPage,
    totalPages
  } = rootStore.profileStore;

  const {openModal, closeModal} = rootStore.modalStore;

  const [loadingNext, setLoadingNext] = useState(false);

  
  const handleGetNext = () => {
    setLoadingNext(true);
    setCommentPage(commentPage +1);
    loadComments(profile!.userName).then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadComments(profile!.userName);
  },[loadComments]); 

    return (
           <Fragment>
             <Segment
               textAlign='left'
               attached='top'
               style={{ border: 'none'}}
             >
               <Header>Comments about this trainer &nbsp;&nbsp;
                   <Icon name="comment outline"></Icon>
               </Header>
             </Segment>
             <Segment>
              <ProfileCommentList />
             <Button
                 floated="right"
                 content="More..." 
                 positive
                 onClick={handleGetNext}
                 disabled={totalPages === commentPage + 1}
                 loading={loadingNext}/>
                  <Button
                      content='Comment'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={()=>openModal("Leave a comment",<ProfileCommentForm closeModal={closeModal} />)}
                    />
             </Segment>
           </Fragment>
    )
}

export default observer(ProfileComments);