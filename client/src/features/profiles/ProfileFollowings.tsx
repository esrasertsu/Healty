import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Tab, Grid, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { useMediaQuery } from 'react-responsive'

const ProfileFollowings = () => {
  const rootStore = useContext(RootStoreContext);
  const {  followings, loading } = rootStore.profileStore;
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  return (
    <Tab.Pane style={{ borderRadius: "12px"}} loading={loading} >
      <Grid>
        <Grid.Column width={16}>
          {/* <Header
            floated='left'
            icon='user'
            content={
              activeTab === 4
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
            }
          /> */}
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={isMobile ? 2 : isTablet ? 3 :6}>
              {followings.map((profile) => (
                   <ProfileCard key={profile.userName} profile={profile} />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
