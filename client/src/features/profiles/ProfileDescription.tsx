import React, { useContext, useEffect, useState } from 'react';
import { Tab, Grid, Header, Button, Icon, List, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileUpdateForm';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser ,setUpdatedProfile, updatedProfile,deleteDocument} = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);
  const {openModal,closeModal,modal} = rootStore.modalStore;

  useEffect(() => {
    if(updatedProfile)
     {
       setEditMode(false);
       toast.success("Profiliniz güncellendi!")
     }
   
  }, [updatedProfile])

  const ref = React.useRef<any>();
  const [height, setHeight] = React.useState("100px");
  const onLoad = () => {
    setHeight(ref.current.contentWindow.document.body.scrollHeight + "px");
  };

  const handleOpenDoc = (url:string) =>{
    if(modal.open) closeModal();
    openModal("Giriş Yap", <>
    <Modal.Description className="loginreg">
    <iframe
        ref={ref}
         onLoad={onLoad}
        id="myFrame"
        src={url}
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="0"
        style={{
          maxWidth: 640,
          width: "100%",
          overflow: "auto",
        }}
      ></iframe>
    </Modal.Description>
    </>,false,
    "",
    "inverted") 

  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={editMode ? 'İptal' : 'Düzenle' }
              onClick={() => 
                { setEditMode(!editMode);
                 setUpdatedProfile(false);
                }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode && !updatedProfile ? (
            <ProfileEditForm updateProfile={updateProfile} profile={profile!} deleteDocument={deleteDocument} />
          ) : 
            (
              <Grid stackable={true} style={{fontSize:"1.1rem"}}>
                <Grid.Row columns={3} className="profile_desc_grid_rows">
                  <Grid.Column className="profile_desc_iconandtext">
                    <Icon className="profileContent_icons" size="big" name="bookmark"></Icon> 
                    <List as='ul' className="profile_desc_list_item" >
                    <Header
                    as='h3'
                    content={`Uzmanlık Alanı`}
                    className="profileContent_icons"
                  />                    
                  {
                     profile!.subCategories.length>0 ? profile!.subCategories.map((subCat) =>(
                      <List.Item key={"desc" + subCat.key} as='li'>{subCat.text}</List.Item>                   
                    )) : <p>Bilgi yok</p>
                    } 
                    </List>
                  </Grid.Column>
                  <Grid.Column className="profile_desc_iconandtext">
                  <Icon className="profileContent_icons" size="big" name="bolt"></Icon> 
                  <List as='ul' className="profile_desc_list_item">
                  <Header
                    as='h3'
                    content={`Erişilebilirlik`}
                    className="profileContent_icons"
                  /> 
                    {
                     profile!.accessibilities.length >0 ? profile!.accessibilities.map((acc) =>(
                      <List.Item key={"desc" + acc.key} as='li'>{acc.text}</List.Item>                   
                    )) : <p>Bilgi yok</p>
                    } 
                    </List>
                  </Grid.Column>
                  <Grid.Column className="profile_desc_iconandtext">
                  <Icon className="profileContent_icons" size="big" name="building outline"></Icon> 
                  <List as='ul' className="profile_desc_list_item">
                  <Header
                    as='h3'
                    content={`Çalıştığı Kurum`}
                    className="profileContent_icons"
                  />                  
                   {(profile!.dependency !=="" && profile!.dependency !==null) ? <List.Item key={"desc" + profile!.dependency} as='li'>{profile!.dependency}</List.Item>  : <p>Bilgi yok</p>}
                  </List>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="profile_desc_grid_rows">
                  <Grid.Column>
                  <Header
                    as='h3'
                    icon='id card outline'
                    content={`Uzman Hakkında`}
                    className="profileContent_icons"
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
                    className="profileContent_icons"
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
                    className="profileContent_icons"
                  />
                  <List  className="profile_desc_list_item">
                    {
                     profile!.certificates.length >0 ? profile!.certificates.map((acc) =>(
                      <List.Item style={{textDecoration:"underline", cursor:"pointer"}} onClick={()=>{handleOpenDoc(acc.url)}} key={"desc" + acc.id}>
                       {acc.resourceType === "image" && <Icon size="large" name={"file alternate outline"}></Icon> }
                       {acc.name}</List.Item>                   
                    )) : "Bilgi yok"
                    } 
                    </List>
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