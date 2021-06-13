import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import ProfileCommentForm from './ProfileCommentForm';
import ProfileCommentList from './ProfileCommentList';
import { IProfile } from '../../app/models/profile';
// interface IProps{
//   profile: IProfile;
// }
 const ProfileComments:React.FC = () => {

  const rootStore = useContext(RootStoreContext);

  const {
    profile,
    loadComments,
    commentPage,
    setCommentPage,
    totalPages,
    getCommentsByDate,
    commentCount
  } = rootStore.profileStore;


  const [loadingNext, setLoadingNext] = useState(false);

  
  const handleGetNext = () => {
    setLoadingNext(true);
    setCommentPage(commentPage +1);
    loadComments(profile!.userName).then(() => setLoadingNext(false))
  }
  // useEffect(() => {
  //   loadComments(profile!.userName);
  // },[loadComments,profile]); 

    return (
           <Fragment>
             <Segment
               textAlign='left'
               attached='top'
               className="profile_segmentHeaders"
             >
               <Header>Yorumlar &nbsp;&nbsp;({getCommentsByDate.length}/{commentCount})
                   {/* <Icon name="comment outline"></Icon> */}
               </Header>
             </Segment>
             <Segment clearing>
               
               <ProfileCommentList handleGetNext={handleGetNext} commentPage={commentPage}
               totalPages={totalPages} loadingNext={loadingNext} getCommentsByDate={getCommentsByDate}/>
               
             </Segment>
           </Fragment>
    )
}

export default observer(ProfileComments);