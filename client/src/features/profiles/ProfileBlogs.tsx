import React, { Fragment, useContext } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { useStore } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import ProfileBlogList from './ProfileBlogList';

 const ProfileBlogs: React.FC = () => {
  
    const rootStore = useStore();

    const {
      profile,
      profileBlogs
    } = rootStore.profileStore;
 
    return (
        <Fragment>
        {/* <Segment
          textAlign='left'
          attached='top'
          className="profile_segmentHeaders"
        > */}
          <Header className='contentHeader'>Blog Yazılar &nbsp; ({profileBlogs.length})
              {/* <Icon name="comment outline"></Icon> */}
          </Header>
        {/* </Segment> */}
        {profileBlogs.length === 0 && <div className='notFoundText'>Henüz paylaştığı bir blog bulunmamaktadır.</div> }
        <ProfileBlogList profileBlogs={profileBlogs} profileUserName={profile!.userName} displayName={profile!.displayName}/>
      </Fragment>
    );
}

export default observer(ProfileBlogs);