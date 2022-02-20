import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, ButtonGroup, Label, Icon, Dimmer, Loader, Image, Reveal, Modal } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone';
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import * as _screenfull from "screenfull";
import ReactPlayer from 'react-player/youtube'
import { history } from '../../';
import LoginForm from '../user/LoginForm';

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

const activityImageTextStyle:any = {
position: 'absolute',
top: '15%',
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
  const {isLoggedIn } = rootStore.userStore;

  const [imageChange, setImageChange] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [originalImage, setOriginalImage] = useState<Blob | null>(null);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 375px)' })

  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  

  const handleLoginClick = (e:any,str:string) => {
    
    if(modal.open) closeModal();

        openModal("Giriş Yap", <>
        <Image  size={isMobile ? 'big': isTabletOrMobile ? 'medium' :'large'} src='/assets/Login1.jpg'  wrapped />
        <Modal.Description className="loginreg">
        <LoginForm location={`/profile/${profile.userName}`} />
        </Modal.Description>
        </>,true,
        "","blurring",true, "loginModal") 
    }

 
  const handleFollowClick =(name:string) =>{
    if(isLoggedIn)
    {
      follow(name);
    }else{
      var str = `/profile/${profile!.userName}`;
      handleLoginClick(null,str);
    }
  }
  const handleVideoPlay = () => {
    if(modal.open) closeModal();

    openModal("",
    <>
  {!isTabletOrMobile && <span style={{float:"right", marginTop:"-5px", cursor:"pointer"}} onClick={closeModal}>Kapat <Icon  name="close" /></span>}
    <ReactPlayer
    config={{ playerVars:{controls:1}}}
    width="auto" 
    height="500px" 
    controls={true}
    url={profile.videoUrl} />
    </>
    ,false,null)
  }

  return (
    <>
    <Segment.Group style={{border:"none",marginBottom:"0"}} >
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
          <div style={activityImageTextStyle}>
          <Label floating style={{cursor:"pointer", left:"80%"}} 
          circular className='blueBtn'
           size={isTabletOrMobile ? "small" :"medium"}
          onClick={()=>{setImageDeleted(true); setImageChange(true)}}>Kapak Resmini Değiştir <Icon name="picture"></Icon></Label>
          </div>
        } 
        </Dimmer.Dimmable>
      </Segment.Group>
    <Segment className="profieHeader_segment" style={{marginTop:0}}>
      <Grid stackable>
        <Grid.Column width={11} className="profieHeader_segment_column">
          <Item.Group>
            <Item className="profieHeader_segment_item" style={{marginTop:"-112px"}}>
              <Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
                className="profieHeader_userImage"
                style={{border: "4px solid #fff", height:"150px", boxShadow: "0 7px 10px 0 #d4d4d5"}}
                onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}
              />
              <Item.Content verticalAlign='middle' className="profileHeader_content">
                <Grid.Row>
                  <Header as='h1' className="profieHeader_displayName" style={{ marginBottom:"5px"}}>{profile.displayName}</Header>
                  {profile!.role === "Trainer" && 
                  <div className="profieHeader_starRating" style={{marginBottom:"10px"}}>
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
                       <Icon size="big" color='red' name="youtube play" /> Tanıtım videosu <Icon name="hand point up"></Icon></div> 
                
                  }
                </Grid.Row>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={5} className="profieHeader_segment_column">
        <Statistic.Group widths={3} size='tiny'>
          <Statistic>
            <Statistic.Value>{profile.activityCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Aktivite 
           {!isMobile && <Icon size="large" name="calendar check outline"></Icon>} 
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.blogCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Blog 
            {!isMobile &&<Icon size="large" name="newspaper outline"></Icon>}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.interactionCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Etkileşim 
            {!isMobile && <Icon size="large" name="comments outline"></Icon>}
            </Statistic.Label>
          </Statistic>
          </Statistic.Group>
          <Divider/>
         
          {!isCurrentUser && 
          <>         
           <Button 
            floated='right'
            loading={loading}
            fluid
            circular
            className='orangeBtn'
            // className={profile.isFollowing ? 'followingButtonOut_redClassName' : 'followingButtonOut_greenClassName'}
              onClick={profile.isFollowing ? () => unfollow(profile.userName): () => handleFollowClick(profile.userName)}
              //disabled={!isLoggedIn} 
              >
              <span style={{marginRight:"5px"}}>{profile.isFollowing ? 'Favorilerimden Çıkar' : 'Favorilere Ekle'}</span> 
                <Icon name='star' />
            </Button>
              </>

          // <Reveal animated='move' style={{width:"100%"}}>
          //   <Reveal.Content visible style={{ width: '100%' }}>
          //     <Button
          //       fluid
          //       className="followingButtonOut"
          //       content={profile.isFollowing ? 'Takip Ediliyor' : 'Takip Edilmiyor'}
          //       icon="hand pointer"
          //     />
          //   </Reveal.Content>
          //   <Reveal.Content hidden>
          //     <Button
          //       loading={loading}
          //       fluid
          //       className={profile.isFollowing ? 'followingButtonOut_redClassName' : 'followingButtonOut_greenClassName'}
          //       content={profile.isFollowing ? 'Takipten Çık' : 'Takip Et'}
          //       disabled={!isLoggedIn}
          //       onClick={profile.isFollowing ? () => unfollow(profile.userName): () => follow(profile.userName)}
          //     />
          //   </Reveal.Content>
          // </Reveal>
          }
          {isCurrentUser && profile.role === "Trainer" &&
            <>
            <Button
              circular
              className='blueBtn'
              content={'Blog Yaz'}
              style={{width:"47%"}}
              onClick={()=> history.push('/createPost')}
            />
            <Button
             className='orangeBtn'
            circular
            
            content={'Aktivite Aç'}
            style={{width:"50%"}}
            onClick={()=> history.push('/createActivity')}
          />
          </>
          }
        </Grid.Column>
      </Grid>
    </Segment>
    </>
  );
};

export default observer(ProfileHeader);
