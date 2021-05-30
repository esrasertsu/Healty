import React, { useContext, useEffect, useState } from 'react';
import { Tab, Grid, Header, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileUpdateForm';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser ,setUpdatedProfile, updatedProfile} = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if(updatedProfile)
     {
       setEditMode(false);
       toast.success("Profiliniz güncellendi!")
     }
   
  }, [updatedProfile])

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`Uzman ${profile!.displayName} Hakkında`}
          />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={editMode ? 'Cancel' : 'Edit Profile' }
              onClick={() => 
                { setEditMode(!editMode);
                 setUpdatedProfile(false);
                }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode && !updatedProfile ? (
            <ProfileEditForm updateProfile={updateProfile} profile={profile!} />
          ) : 
            (
              <span>{profile!.bio}</span>
            )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);