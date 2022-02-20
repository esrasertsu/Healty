import React, { useContext, useEffect, useState } from 'react'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Button, Grid, Header, Icon,  Modal,Segment } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { IPhoto, ReferancePhoto } from '../../app/models/profile'
import { observer } from 'mobx-react-lite'
import { useMediaQuery } from 'react-responsive'

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import SwiperCore, {
  Pagination,Navigation,Mousewheel,Keyboard
} from 'swiper';
import ActivityGalleryModal from '../activities/details/ActivityGalleryModal'
import PhotoGallery from '../activities/form/PhotoGallery'


SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);

interface IProps{
  referencePics:IPhoto[]
}

const ProfileReferances:React.FC<IProps> = ({referencePics}) => {

  const rootStore = useContext(RootStoreContext);
  const { saveReferencePics,uploadingReferencePics , isCurrentUser } = rootStore.profileStore;

const [open, setOpen] = React.useState(false)
const [title, setTitle] = useState("");
const [galleryModal, setGalleryModal] = useState(false);
const [imageIndex, setImageIndex] = useState(0)

const [docs, setDocs] = useState<any[]>([]);
const [filedocs, setFileDocs] = useState<any[]>([]);
const [newMainId, setNewMainId] = useState("");
const [refPics, setRefPics] =  useState<IPhoto[]>([]);
const [newRefPics, setNewRefPics] =  useState<IPhoto[]>([]);
const [deletedRefPics, setDeletedRefPics] =  useState<string[]>([]);

const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);


  const isWideMobileOrSmaller = useMediaQuery({ query: '(max-width: 430px)' })

    const smallItemStyles: React.CSSProperties = {
      cursor: 'pointer',
      objectFit: 'cover',
      width: '100%',
      maxHeight: '100%',
      height:"100%"
    }


    const onGalleryModalClose = () => {
      setGalleryModal(false);
    }
  
    const openGalleryModal = (index:number) => {
        setImageIndex(index);
        setGalleryModal(true);

    }

    useEffect(() => {
      setRefPics([...referencePics]);
      
    }, [referencePics])


    
useEffect(() => {
  if(docs.length > 0)
  docs.forEach(doc => {
    uploadedNewImage(doc)
  });
 
  
}, [docs])


const deleteActivityPhoto = (photo:IPhoto) =>{

  if(photo.id !== "")
  { 
    setDeletedRefPics([...deletedRefPics, photo.id])
      
      let restPhotos = refPics!.filter(x => x.id !== photo.id);
      setRefPics(restPhotos);

  }else{
    let restNews =  newRefPics.filter(x => x.url !== photo.url );
    setNewRefPics(restNews);
    let restPhotos =  refPics.filter(x => x.url !== photo.url );
    setRefPics(restPhotos);
  }
}


const uploadedNewImage = (file:any) =>{
  var reader = new FileReader();
  var url = reader.readAsDataURL(file);//original blob data dönüyor

   reader.onloadend = function (e:any) { //okuma işlemi bitince file update ediliyor preview data ile.
      console.log(reader.result)//blob var

      const newPic = new ReferancePhoto(file);

      setRefPics([...refPics,newPic]);
      setNewRefPics([...newRefPics,file]);
    }; 
}

const handleSaveRef = () =>{
  saveReferencePics(newRefPics,deletedRefPics).then(() => {
    setOpen(false);
  }
   )
}



    return (
<>
{galleryModal && 
         <ActivityGalleryModal currentImageIndex={imageIndex} onClose={onGalleryModalClose} images={referencePics} /> 
        }
      <Modal 
      size="large"
      closeIcon
      onClose={() => {setOpen(false);setRefPics([...referencePics]);setDeletedRefPics([]);setNewRefPics([])}}
      onOpen={() => {setOpen(true);setRefPics([...referencePics]);}}
      open={open}
      dimmer="blurring"
    >
      <Modal.Header> <h3>Referans İşler Galerisi</h3></Modal.Header> 
      <Modal.Content>
      { 
     <PhotoGallery docs={refPics} setDocuments={setDocs} setFiles={setFileDocs} setUpdateEnabled={setUpdateEnabled}
     deleteActivityPhoto={deleteActivityPhoto} newMainId={newMainId}/>
          
          }
      </Modal.Content>
      <Modal.Actions>
        <Button primary content="Kaydet" loading={uploadingReferencePics} onClick={handleSaveRef} disabled={newRefPics.length===0 && deletedRefPics.length===0}></Button>
      </Modal.Actions>
    </Modal>
        <Header>Referans İşler </Header>

      <Segment style={{display:"flex", flexDirection:"column"}}>
      {isCurrentUser && referencePics.length < 7 && (
        <div>
            <Button
              floated='right'
              circular
              size='mini'
              className={'blueBtn'}
              content={<span>Düzenle <Icon name='edit'></Icon></span>}
              loading={uploadingReferencePics}
              onClick={() => 
                { setOpen(!open);
                }}
            />
        </div>
            
          )}
                <Grid stackable style={{width:"100%", margin:"0"}} >
                   
                    <Grid.Row>
                        <Grid.Column width={16}>
     {referencePics.length !== 0 ?      
      <>
      <Swiper cssMode={true} navigation={true} pagination={true} mousewheel={true} keyboard={true} className="activitySwiper">
                    {
                      referencePics.map((photo:IPhoto) =>
                      <SwiperSlide key={photo.id}>
                        <img style={smallItemStyles} key={photo.id} src={photo.url}  onClick={() => openGalleryModal(0)}  />
                      </SwiperSlide>
                      )
                    }  
                    </Swiper>
      </>
    :  <span><Icon name="meh outline" />Henüz paylaşılan bir referans görsel bulunmamaktadır.</span> 
    }
       </Grid.Column>
       </Grid.Row>
     </Grid>
     </Segment>
  

      </>
    )
  }


  export default observer(ProfileReferances);
