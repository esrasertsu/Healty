import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Tab, Grid, Card, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { useMediaQuery } from 'react-responsive'

const ProfileFollowings = () => {
  const rootStore = useStore();
  const {  followings, loading,activeTab } = rootStore.profileStore;
  const {  isLoggedIn } = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  return (
    <Tab.Pane style={{ borderRadius: "12px"}} loading={loading} >
      <Grid>
      { isTablet &&  <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            style={{fontSize:"16px"}}
            content={
              activeTab === 4
                ? `Takipçileri`
                : `Favorileri`
            }
          /> 
        </Grid.Column>}
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={isMobile ? 2 : isTablet ? 3 :5}  style={{ maxHeight: "260px", overflow: "hidden",overflowY: "scroll"}}>
            {isLoggedIn?
            followings.map((profile) => (
              <ProfileCard key={profile.userName} profile={profile} />
            )):
            <div style={{margin:"10px"}}>Kişinin favorilerini görebilmek için giriş yapmalısın.</div>
            }
             
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
