import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Segment, Image, Label, Icon, Grid, Header, Dimmer, Loader } from 'semantic-ui-react'
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper';
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone';
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';

const activityImageStyle = {
    width:"100%"
};

const activityImageTextStyle = {
  position: 'absolute',
  top: '10%',
  width: '100%',
  height: 'auto',
  color: 'white',
};
const BlogPageHeader:React.FC<{blog:IBlog}> = ({blog}) => {

  const rootStore = useContext(RootStoreContext);
  const { isCurrentUserAuthor,editBlogImage,submittingPhoto } = rootStore.blogStore;
  const [imageChange, setImageChange] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [originalImage, setOriginalImage] = useState<Blob | null>(null);

  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

    return (

      //placeholder yerleştir olur da blog undefined null vs gelirse diye
      <Segment.Group style={{border:"none"}}>
         <Dimmer.Dimmable as={Segment} dimmed={submittingPhoto} basic attached='top' style={!imageChange ? { padding: '0' ,border:"none"}: {padding: '0',marginBottom:"155px",border:"none"}}>
          <Dimmer active={submittingPhoto} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
                  {
                   blog.photo && !imageChange ?
                   <Segment>
                    <Image src={blog.photo} fluid style={activityImageStyle}/>
                  </Segment>
                :
                files.length === 0 ? 
                <div style={{marginBottom:15}}>
                <PhotoWidgetDropzone setFiles={setFiles} />
                </div>
                :
               (
                <Grid style={{marginTop:"10px"}}>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={1500/650}/>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                  </Grid.Column>

                  <Grid.Column width="eight">
                  <div style={{display:"flex"}}>
                  <Label color="red" style={{marginBottom:"20px", cursor:"pointer"}} 
                  onClick={()=> {setFiles([]);setImageDeleted(true);}}>Değiştir/Sil <Icon name="trash"></Icon></Label>
                  <Label style={{marginBottom:"20px", cursor:"pointer"}} onClick={()=> {
                  setImageChange(false); setImageDeleted(false); setFiles([])}}>Değişiklikleri geri al <Icon name="backward"></Icon> </Label>   
                   {image && <Label color="green" style={{marginBottom:"20px", cursor:"pointer"}} onClick={()=> {
                   
                    editBlogImage(blog.id,image!,setImageChange).then(() => {
                    setImageDeleted(false); setFiles([])
                  }) 
                  }}>Kaydet <Icon name="save"></Icon> </Label>  } 
                 
                  </div>             
                  </Grid.Column>
               </Grid>
               )
         }  
        {
          !imageChange && isCurrentUserAuthor &&
          <Segment basic style={activityImageTextStyle}>
          <Label floating color="blue" style={{cursor:"pointer", left:"80%"}} 
          onClick={()=>{setImageDeleted(true); setImageChange(true)}}>Blog Resmini Değiştir <Icon name="edit"></Icon></Label>
          </Segment>
        } 
        </Dimmer.Dimmable>
      </Segment.Group>
                
    )
}

export default observer(BlogPageHeader)