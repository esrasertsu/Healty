import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import ProfileBlogList from './ProfileBlogList';

 const ProfileBlogs: React.FC = () => {
  
    const rootStore = useContext(RootStoreContext);

    const {
      profile,
      loadBlogs,
      blogPage,
      setBlogPagination,
      totalBlogPages,
      getBlogsByDate
    } = rootStore.profileStore;
  
    const [loadingNext, setLoadingNext] = useState(false);
    
    const handleGetNext = () => {
      setLoadingNext(true);
      setBlogPagination(blogPage +1);
      loadBlogs(profile!.userName).then(() => setLoadingNext(false))
    }
   
    return (
        <Fragment>
        <Segment
          textAlign='left'
          attached='top'
          className="profile_segmentHeaders"
        >
          <Header>Blog Yazılar &nbsp; ({getBlogsByDate.length})
              {/* <Icon name="comment outline"></Icon> */}
          </Header>
        </Segment>
        {getBlogsByDate.length === 0 && "Henüz paylaştığı bir blog bulunmamaktadır."}
        <ProfileBlogList handleGetNext={handleGetNext} totalBlogPages={totalBlogPages} loadingNext={loadingNext}
         blogPage={blogPage} getBlogsByDate={getBlogsByDate} profileUserName={profile!.userName} displayName={profile!.displayName}/>
      </Fragment>
    );
}

export default observer(ProfileBlogs);