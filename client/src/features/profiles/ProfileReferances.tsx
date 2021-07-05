import React, { useContext, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Button, Form, Grid, Header, Image, Modal, Popup, TextArea } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { IRefencePic } from '../../app/models/profile'
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone'
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper'
import { observer } from 'mobx-react-lite'





const ProfileReferances = () => {

  const rootStore = useContext(RootStoreContext);
  const {referencePics, uploadReferencePic, deletingReferencePic,uploadingReferencePics, deleteReferencePic , isCurrentUser } = rootStore.profileStore;

const [files, setFiles] = useState<any[]>([]);
const [image, setImage] = useState<Blob | null>(null);
const [originalImage, setOriginalImage] = useState<Blob | null>(null);

const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
const [imageChange, setImageChange] = useState(false);
const [imageDeleted, setImageDeleted] = useState(false);
const [open, setOpen] = React.useState(false)
const [title, setTitle] = useState("");

  const handleUploadImage = (photo: Blob) => {
    debugger;
    uploadReferencePic(originalImage!,photo,title).then(() => {
      setOpen(false);
      setFiles([]);}
     )
  }


    const smallItemStyles: React.CSSProperties = {
      cursor: 'pointer',
      objectFit: 'cover',
      width: '100%',
      maxHeight: '100%',
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
               <Grid.Column width="16">
               <Header sub content='*Resmin küçük görselini ayarlayın' />
               <PhotoWidgetCropper setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={referencePics.length=== 0 ? 240/240: 171/114}/>
               </Grid.Column>
               <Grid.Column width="16">
                 <Header sub content='*Önizleme' />
                 <Image src={croppedImageUrl} style={{minHeight:'200px'}}/>
               </Grid.Column>
               <Grid.Column width="16">
               <Header sub content='Açıklama' />
                 <Form>
                    <TextArea placeholder="Referans göstermek istediğiniz görsel ile ilgili yorum bırakabilirsiniz." value={title} onChange={(e,data) => setTitle(data.value!.toString())} />
                 </Form>
              </Grid.Column>
               <Grid.Column width="eight">
               <div style={{display:"flex"}}>
               <Button.Group widths={2}>
                      <Button positive icon='check' loading={uploadingReferencePics} onClick={()=> handleUploadImage(image!)}></Button>
                      <Button icon='close' disabled={uploadingReferencePics} onClick={()=> setFiles([])}></Button>
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
        <Header>Referans İşler
    </Header>
    {referencePics.length === 0 ? "Henüz paylaştığı bir referans görsel bulunmamaktadır." :

    <Grid>
      <Grid.Column width="16">
      {isCurrentUser && referencePics.length < 7 && (
            <Button
              floated='right'
              basic
              content={'Yükle' }
              onClick={() => 
                { setOpen(!open);
                }}
            />
          )}
      </Grid.Column>
      <Grid.Column width="16">
            
      <Gallery id="simple-gallery">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px 171px 171px 171px',
            gridTemplateRows: '114px 114px',
            gridGap: 12,
          }}
        >
         {referencePics.map((image: IRefencePic,index:number) => (
          <Item
            key={image.originalPublicId}
            id={image.originalPublicId}
            original={image.originalUrl}
            thumbnail={image.thumbnailUrl}
            width={image.width}
            height={image.height}
            title={image.title}
          >
            {({ ref, open }) => (
              <>
              <Popup key={image.thumbnailPublicId+"popup"} trigger={
                <img
                key={image.thumbnailPublicId}
                style={index === 0 ? { cursor: 'pointer' }: index === 4 ? { ...smallItemStyles, gridColumnStart: 2 } : smallItemStyles} //transform: `${hovered ? 'scale(1.5,1.5)' : 'scale(1, 1)'}`
                src={image.thumbnailUrl}
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />

              } hoverable>
                <Grid centered divided columns={1}>
                <Grid.Column textAlign='center'>
                  <Button key={image.thumbnailPublicId+"button"} color="red" loading={deletingReferencePic} onClick={() => deleteReferencePic(image.originalPublicId)}>Sil</Button>
                </Grid.Column>
              </Grid>
            </Popup>
              
              </>
            )}
          </Item> 
         ))}
         <br></br>
          {/* <Item
            original="https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg"
            thumbnail="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
            width="1600"
            height="1068"
            title="Author: Samuel Rohl"
          >
            {({ ref, open }) => (
              <img
                style={smallItemStyles}
                src="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item>
          <Item
            original="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_b.jpg"
            thumbnail="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg"
            width="1600"
            height="1066"
            title="Author: Ales Krivec"
          >
            {({ ref, open }) => (
              <img
                style={smallItemStyles}
                src="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item>
          <Item
            original="https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg"
            thumbnail="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
            width="1600"
            height="1066"
            title="Author: Michael Hull"
          >
            {({ ref, open }) => (
              <img
                style={ smallItemStyles }
                src="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item>
          <Item
            original="https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg"
            thumbnail="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
            width="1600"
            height="1066"
            title="Author: Michael Hull"
          >
              
            {({ ref, open }) => (
              <img
                style={{ ...smallItemStyles, gridColumnStart: 2 }}
                src="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item>
          <Item
            original="https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg"
            thumbnail="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
            width="1600"
            height="1066"
            title="Author: Thomas Lefebvre"
          >
            {({ ref, open }) => (
              <img
                style={smallItemStyles}
                src="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item>
          <Item
            original="https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg"
            thumbnail="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
            width="1600"
            height="1066"
            title="Author: Thomas Lefebvre"
          >
            {({ ref, open }) => (
              <img
                style={smallItemStyles}
                src="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                onClick={open}
              />
            )}
          </Item> */}
        </div>
      </Gallery>
      </Grid.Column>
    </Grid>
}
      </>
    )
  }


  export default observer(ProfileReferances);
