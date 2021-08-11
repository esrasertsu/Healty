import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Card, Grid, Header, Icon, Image, Label, Modal, Segment, Tab } from "semantic-ui-react";
import PhotoUploadWidget  from "../../app/common/photoUpload/PhotoUploadWidget";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoWidgetCropper from "../../app/common/photoUpload/PhotoWidgetCropper";
import PhotoWidgetDropzone from "../../app/common/photoUpload/PhotoWidgetDropzone";

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
    "") 

  }

  return (
    <>
      <Modal
      size="large"
      dimmer="blurring"
      closeIcon
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
               <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={700/700}/>
               </Grid.Column>
               <Grid.Column width="eight">
                 <Header sub content='*Önizleme' />
                 <Image src={croppedImageUrl} style={{minHeight:'200px',}}/>
               </Grid.Column>

               <Grid.Column width="eight">
               <div style={{display:"flex"}}>
               <Button.Group widths={2}>
                      <Button positive icon='check' loading={uploadingPhoto} onClick={()=> handleUploadImage(image!)}></Button>
                      <Button icon='close' disabled={uploadingPhoto} onClick={()=> setFiles([])}></Button>
                  </Button.Group> 
               </div>             
               </Grid.Column>
            </Grid>
            </Modal.Description>
            )
            // <PhotoUploadWidget
            //   uploadPhoto={handleUploadImage}
            //   loading={uploadingPhoto}
            //   aspect={500/500}
            // />
          }
      </Modal.Content>
    </Modal>
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          {/* <Header floated="left" icon="image" content="Photos" /> */}
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
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
               <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={500/500}/>
               </Grid.Column>
               <Grid.Column width="eight">
                 <Header sub content='*Önizleme' />
                 <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
               </Grid.Column>

               <Grid.Column width="eight">
               <div style={{display:"flex"}}>
               <Button.Group widths={2}>
                      <Button positive icon='check' loading={uploadingPhoto} onClick={()=> handleUploadImage(image!)}></Button>
                      <Button icon='close' disabled={uploadingPhoto} onClick={()=> setFiles([])}></Button>
                  </Button.Group> 
               </div>             
               </Grid.Column>
            </Grid>
            )
            // <PhotoUploadWidget
            //   uploadPhoto={handleUploadImage}
            //   loading={uploadingPhoto}
            //   aspect={500/500}
            // />
          ) : (
            <>
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.filter(x => x.isCoverPic === false).map((photo) => (
                  <Card key={photo.id}>
                    <Image onClick={() => handlePhotoClick(photo.url)} src={photo.url} />
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
                          content="Main"
                        />
                        <Button
                          name={photo.id}
                          disabled={photo.isMain}
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