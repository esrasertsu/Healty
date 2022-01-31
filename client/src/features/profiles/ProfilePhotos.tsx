import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Card, Grid, Header, Icon, Image, Label, Modal, Segment, Tab } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoWidgetCropper from "../../app/common/photoUpload/PhotoWidgetCropper";
import PhotoWidgetDropzone from "../../app/common/photoUpload/PhotoWidgetDropzone";
import { useMediaQuery } from 'react-responsive'

 const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, uploadPhoto , uploadingPhoto, setMainPhoto,loadingForPhotoDeleteMain,deletePhoto } = rootStore.profileStore;
  const { openModal,closeModal,modal } = rootStore.modalStore;

  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);


const [files, setFiles] = useState<any[]>([]);
const [image, setImage] = useState<Blob | null>(null);
const [originalImage, setOriginalImage] = useState<Blob | null>(null);

const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
const [imageChange, setImageChange] = useState(false);
const [imageDeleted, setImageDeleted] = useState(false);
const [open, setOpen] = React.useState(false)

const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })


  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => {
      setAddPhotoMode(false);
      setOpen(false);
      setFiles([]);}
     )
  }

  const handlePhotoClick = (url:string) => {
    openModal("", <>
    <Modal.Description>
      <Image style={{margin:"auto"}} src={url}  />
    </Modal.Description>
    </>,false,
    "","blurring",true) 

  }


  return (
    <>
      <Modal
      size="large"
      dimmer="blurring"
      closeIcon
      closeOnDimmerClick={true}
      onClose={() => {setOpen(false);setFiles([]);}}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {/* <Modal.Header></Modal.Header> */}
      <Modal.Content>
      { files.length === 0 ? 
        <Modal.Description>
             <div style={{marginBottom:15}}>
             <PhotoWidgetDropzone setFiles={setFiles} />
             </div> 
             </Modal.Description>
             :    
            (
              <Modal.Description>
             <Grid style={{marginTop:"10px"}}>
               <Grid.Column width="eight">
               <Header sub content='*Boyutlandır' />
               <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={700/700} maxHeight={700}/>
               </Grid.Column>
               <Grid.Column width="eight">
                 <Header sub content='*Önizleme' />
                 <Image src={croppedImageUrl} style={{minHeight:'200px',}}/>
               </Grid.Column>

               <Grid.Column width="eight">
               <div style={{display:"flex"}}>
               <Button.Group widths={2}>
                      <Button positive circular icon='check' loading={uploadingPhoto} onClick={()=> handleUploadImage(image!)}></Button>
                      <Button icon='close' circular disabled={uploadingPhoto} onClick={()=> setFiles([])}></Button>
                  </Button.Group> 
               </div>             
               </Grid.Column>
            </Grid>
            </Modal.Description>
            )
           
          }
      </Modal.Content>
    </Modal>
    <Tab.Pane style={{ borderRadius: "12px"}}>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
        { isTabletOrMobile && 
          <Header
            floated='left'
            icon='user'
            style={{fontSize:"16px"}}
            content="Fotoğraflar"
          /> }
          {isCurrentUser && profile && profile.photos && profile.photos.length <6 && (
            <Button
              floated="left"
              basic
              circular
              color="blue"
              content={addPhotoMode ? "Geri" : "Resim Ekle"}
              onClick={() => setOpen(true)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? 
          (
             files.length === 0 ? 
             <div style={{marginBottom:15}}>
             <PhotoWidgetDropzone setFiles={setFiles}  />
             </div> :    
            (
             <Grid style={{marginTop:"10px"}}>
               <Grid.Column width="eight">
               <Header sub content='*Boyutlandır' />
               <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={500/500} maxHeight={500}/>
               </Grid.Column>
               <Grid.Column width="eight">
                 <Header sub content='*Önizleme' />
                 <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
               </Grid.Column>

               <Grid.Column width="eight">
               <div style={{display:"flex"}}>
               <Button.Group widths={2}>
                      <Button circular positive icon='check' loading={uploadingPhoto} onClick={()=> handleUploadImage(image!)}></Button>
                      <Button circular icon='close' disabled={uploadingPhoto} onClick={()=> setFiles([])}></Button>
                  </Button.Group> 
               </div>             
               </Grid.Column>
            </Grid>
            )
          
          ) : (
            <>
            <Card.Group itemsPerRow={isTabletOrMobile ? 3 :5}>
              {profile &&
                profile.photos.filter(x => x.isCoverPic === false).map((photo) => (
                  <Card key={photo.id}>
                    <Image onClick={() => handlePhotoClick(photo.url)} src={photo.url} 
                     onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}/>
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          onClick={(e) => {
                            setMainPhoto(photo);
                            setTarget(e.currentTarget.name);
                          }}
                          disabled={photo.isMain}
                          loading={loadingForPhotoDeleteMain && target === photo.id}
                          basic
                          positive
                          content="Profil"
                          circular
                        />
                        <Button
                          name={photo.id}
                          disabled={photo.isMain}
                          circular
                          onClick={(e) => {
                            deletePhoto(photo);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          loading={loadingForPhotoDeleteMain && deleteTarget === photo.id}
                          basic
                          negative
                          icon="trash"
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
    </>
  );
};

export default observer(ProfilePhotos)