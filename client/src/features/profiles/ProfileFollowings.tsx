import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Tab, Grid, Card, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { useMediaQuery } from 'react-responsive'

const ProfileFollowings = () => {
  const rootStore = useContext(RootStoreContext);
  const {  followings, loading,activeTab } = rootStore.profileStore;
  const {  isLoggedIn } = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
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
                : `Takip Ettikleri`
            }
          /> 
        </Grid.Column>}
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={isMobile ? 2 : isTablet ? 3 :6}>
            {isLoggedIn?
            followings.map((profile) => (
              <ProfileCard key={profile.userName} profile={profile} />
            )):
            <div style={{marginLeft:"10px", marginBottom:"10px"}}>Uzmanın takip ettiklerini ya da takipçilerini görebilmek için online olmalısın.</div>
            }
             
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
