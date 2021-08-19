import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal, ButtonGroup, Label, Icon, Dimmer, Loader, Image } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone';
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import * as _screenfull from "screenfull";
import ReactPlayer from 'react-player/youtube'

interface IProps{
    profile: IProfile,
    isCurrentUser:boolean,
    follow:(username: string) => void, 
    unfollow:(username: string) => void,
    loading:boolean
}

const activityImageStyle = {
  width:"100%",
  height:"300px"
};

const activityImageTextStyle = {
position: 'absolute',
top: '10%',
width: '100%',
height: 'auto',
color: 'white',
};

const ProfileHeader:React.FC<IProps> = ({profile, loading, follow, unfollow,isCurrentUser}) => {
  
  const profileRating = profile ? profile.star : 0;

  const getColor = (catName:string) =>{
    let index = colors.findIndex(x => x.key === catName);
    return colors[index].value;
  }



  const rootStore = useContext(RootStoreContext);
  const { uploadCoverPic,uploadingCoverImage } = rootStore.profileStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;
  const [imageChange, setImageChange] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [originalImage, setOriginalImage] = useState<Blob | null>(null);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

 
  const handleVideoPlay = () => {
    if(modal.open) closeModal();

    openModal("",
    <ReactPlayer
    config={{ playerVars:{controls:1}}}
    width="auto" 
    height="500px" 
    controls={true}
    url={profile.videoUrl} />
    ,false,null)
  }

  return (
    <>
    <Segment.Group style={{border:"none"}}>
         <Dimmer.Dimmable as={Segment} dimmed={uploadingCoverImage} basic attached='top' style={{ padding: '0' ,border:"none"}}>
          <Dimmer active={uploadingCoverImage} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
                  {
                   profile.coverImage && !imageChange ?
                   <Segment style={{padding:'0', margin:'0'}}  className="coverImage">
                    <Image src={profile.coverImage} fluid style={activityImageStyle} />
                  </Segment>
                :
               
                  files.length === 0 ? 
                  (
                    isCurrentUser ? 
                    <PhotoWidgetDropzone setFiles={setFiles} /> 
                    :
                    <Segment style={{padding:'0', margin:'0'}}  className="coverImage">
                      <Image src={'/assets/trainerback.png'} fluid style={activityImageStyle} />
                    </Segment> 
                  )
                  :
                 (
                  <Grid style={{marginTop:"10px"}}>
                    <Grid.Column width="sixteen" style={{background:"#f1f1f1"}}>
                    <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <Label color="red" style={{cursor:"pointer"}} 
                    onClick={()=> {setFiles([]);setImageDeleted(true);}}>Değiştir/Sil <Icon name="trash"></Icon></Label>
                    <Label style={{cursor:"pointer"}} onClick={()=> {
                    setImageChange(false); setImageDeleted(false); setFiles([])}}>Değişiklikleri geri al <Icon name="backward"></Icon> </Label>   
                     {image && <Label color="green" style={{ cursor:"pointer"}} onClick={()=> {
                     
                      uploadCoverPic(image!,setImageChange).then(() => {
                      setImageDeleted(false); setFiles([])
                    }) 
                    }}>Kaydet <Icon name="save"></Icon> </Label>  } 
                   
                    </div>             
                    </Grid.Column>
                    <Grid.Column width="sixteen" className="profileHeaderImageCrop">
                      <Header sub content='*Kırpma/Önizleme' />
                      <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={1350/300} maxHeight={300}/>
                    </Grid.Column>
                 </Grid>
                 )
               
         }  
        {
          !imageChange && isCurrentUser && profile.coverImage !== null &&
          <Segment basic style={activityImageTextStyle}>
          <Label floating color="blue" style={{cursor:"pointer", left:"80%"}} 
           size={isTabletOrMobile ? "small" :"medium"}
          onClick={()=>{setImageDeleted(true); setImageChange(true)}}>Kapak Resmini Değiştir <Icon name="edit"></Icon></Label>
          </Segment>
        } 
        </Dimmer.Dimmable>
      </Segment.Group>
    <Segment className="profieHeader_segment" style={{marginTop:0}}>
      <Grid stackable>
        <Grid.Column width={12}>
          <Item.Group>
            <Item style={{marginTop:"-105px"}}>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
                style={{border: "4px solid #fff", width:"175px", height:"175px"}}
              />
              <Item.Content verticalAlign='middle' className="profileHeader_content">
                <Grid.Row>
                  <Header as='h1' style={{color:"#fff", marginBottom:"5px", textShadow: "1.5px 1.5px #263a5e"}}>{profile.displayName}</Header>
                  {profile!.role === "Trainer" && 
                  <div style={{marginBottom:"10px", textShadow: "rgb(69 60 38) 1.5px 1.5px"}}>
                    <StarRating rating={profileRating} editing={false} key={"header"} count={profile.starCount} showCount={true}/>
                  </div>
                    }
                  <br/>
                  {profile!.role === "Trainer" && profile.categories.map((cat) => (
                    <Label className="profileHeader_label" key={cat.key} style={{background:getColor(cat.text)}} horizontal>{cat.text}</Label>
                  ))}
                  {
                     (profile.videoUrl!=="" && profile.videoUrl !== null) &&
                     <div onClick={handleVideoPlay} className="profileHeader_videoPlay">
                       <Image style={{width:"35px", marginRight:"10px"}} src={'/assets/videoPlayer.png'} />Tanıtım videosu <Icon name="hand point up"></Icon></div> 
                
                  }
                </Grid.Row>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
        <Statistic.Group widths={3} size='tiny'>
          <Statistic>
            <Statistic.Value>{profile.activityCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Aktivite <Icon size="large" name="calendar check outline"></Icon></Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.blogCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Blog <Icon size="large" name="newspaper outline"></Icon></Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.interactionCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Etkileşim <Icon size="large" name="comments outline"></Icon></Statistic.Label>
          </Statistic>
          </Statistic.Group>
          <Divider/>
         
        </Grid.Column>
      </Grid>
    </Segment>
    </>
  );
};

export default observer(ProfileHeader);
