import React, { useContext, useEffect, useState } from 'react';
import { Tab, Grid, Header, Button, Icon, List } from 'semantic-ui-react';
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
              <Grid stackable={true} style={{fontSize:"1.1rem"}}>
                <Grid.Row columns={3} className="profile_desc_grid_rows">
                  <Grid.Column className="profile_desc_iconandtext">
                    <Icon color="teal" size="big" name="bookmark"></Icon> 
                    <List as='ul' className="profile_desc_list_item" >
                    {
                     
                     profile!.subCategories.length>0 ? profile!.subCategories.map((subCat) =>(
                      <List.Item as='li'>{subCat.text}</List.Item>                   
                    )) : "Bilgi yok"
                    } 
                    </List>
                  </Grid.Column>
                  <Grid.Column className="profile_desc_iconandtext">
                  <Icon color="teal" size="big" name="bolt"></Icon> 
                  <List as='ul' className="profile_desc_list_item">
                    {
                     profile!.accessibilities.length >0 ? profile!.accessibilities.map((acc) =>(
                      <List.Item as='li'>{acc.text}</List.Item>                   
                    )) : "Bilgi yok"
                    } 
                    </List>
                  </Grid.Column>
                  <Grid.Column className="profile_desc_iconandtext">
                  <Icon color="teal" size="big" name="building outline"></Icon> 
                  <div>{profile!.dependency || "Bilgi yok"}</div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="profile_desc_grid_rows">
                  <Grid.Column>
                  <Header
                    as='h3'
                    icon='id card outline'
                    content={`Uzman Hakkında`}
                    color="teal"
                  />
                <p>{profile!.bio || "Bilgi yok"}</p>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="profile_desc_grid_rows">
                <Grid.Column>
                  <div className="profile_desc_iconandtext">
                  <Header
                    as='h3'
                    icon='spinner'
                    content={`Tecrübe`}
                    color="teal"
                  />
                    <div>{profile!.experienceYear>0 ? "("+profile!.experienceYear +" yıl)":""}</div>
                  </div>
                  <p>{profile!.experience || "Bilgi yok"}</p>
                  </Grid.Column>
                 
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                  <Header
                    as='h3'
                    icon='graduation cap'
                    content={`Eğitim`}
                    color="teal"
                  />
                  <p>{profile!.certificates || "Bilgi yok"}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);