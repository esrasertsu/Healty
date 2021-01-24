import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Card, Grid, Header } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard'

 const ProfileList: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingProfiles, loadProfiles, profileList, follow, unfollow, isCurrentUser} = rootStore.profileStore;
    useEffect(() => {
        loadProfiles();
    }, [loadProfiles])

    if(loadingProfiles) 
    return <LoadingComponent content='Loading profiles...' />

    return (
        <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content="Trainers"
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={6}>
              {profileList.map((profile) => (
                   <ProfileCard key={profile.userName} profile={profile} />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    )
}

export default observer(ProfileList)
