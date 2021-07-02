import React, { Fragment, useContext } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import ProfileBlogList from './ProfileBlogList';

 const ProfileBlogs: React.FC = () => {
  
    const rootStore = useContext(RootStoreContext);

    const {
      profile,
      profileBlogs
    } = rootStore.profileStore;
 
    return (
        <Fragment>
        <Segment
          textAlign='left'
          attached='top'
          className="profile_segmentHeaders"
        >
          <Header>Blog Yazılar &nbsp; ({profileBlogs.length})
              {/* <Icon name="comment outline"></Icon> */}
          </Header>
        </Segment>
        {profileBlogs.length === 0 && "Henüz paylaştığı bir blog bulunmamaktadır."}
        <ProfileBlogList profileBlogs={profileBlogs} profileUserName={profile!.userName} displayName={profile!.displayName}/>
      </Fragment>
    );
}

export default observer(ProfileBlogs);