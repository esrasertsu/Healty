import React, { useContext } from 'react';
import { Card, Image, Icon, Grid, Label, Modal, Popup, Button} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';
import { observer } from 'mobx-react-lite';
import LoginForm from '../user/LoginForm';
import { useMediaQuery } from 'react-responsive';

interface IProps {
    profile: IProfile,
    popular?: boolean
}

 const ProfileListItem: React.FC<IProps> = ({profile,popular}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile,follow,unfollow} = rootStore.profileStore;
  const {isLoggedIn,user} = rootStore.userStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 375px)' })

  const getColor = (catName:string) =>{
    let index = colors.findIndex(x => x.key === catName);
    return colors[index].value;
  }
  const handleLoginClick = (e:any,str:string) => {
    
    if(modal.open) closeModal();

        openModal("Giriş Yap", <>
        <Image  size={isMobile ? 'big': isTabletOrMobile ? 'medium' :'large'}  wrapped />
        <Modal.Description className="loginreg">
        <LoginForm location={str} />
        </Modal.Description>
        </>,true,
        "","blurring",true, "loginModal") 
    }


  const handleFollowTrainer = (name:string, profile:IProfile) =>{
    if(isLoggedIn)
    {
      follow(name).then(() =>{
        profile.isFollowing = true;
      })
    }else{
      var str = `/profile/${name}`;
      handleLoginClick(null,str);
    }
  }

  
  const handleUnfollowTrainer = (name:string,profile:IProfile) =>{
    if(isLoggedIn)
    {
      unfollow(name).then(() =>{
        profile.isFollowing = false;
      })
    }else{
      var str = `/profile/${name}`;
      handleLoginClick(null,str);
    }
  }

  const handleCardClick = (e:any) => {
    e.stopPropagation() ;
  
      setLoadingProfile(true);
      history.push(`/profile/${profile.userName}`)
      
}
  return (
    <Card
      style={{height:"100%", marginBottom:"10px", minHeight:"450px"}}
      key={profile.userName+Math.random()} >
        {
         (!isLoggedIn || (user && profile.userName !== user.userName)) && 
          <Icon 
          className='profileListItem_addToFav' 
          name={profile.isFollowing?"heart" :"heart outline"}  
          color={profile.isFollowing?"red" :undefined}
          onClick={() => profile.isFollowing ? handleUnfollowTrainer(profile.userName,profile) :handleFollowTrainer(profile.userName, profile) } />
         
        }
    
     <Image src={profile.image || '/assets/user.png'} 
      onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}
      />
      <div className="profileListItem_badges">   
      {(profile.categories && profile.categories.map((cat) => (
          <Label key={profile.userName+Math.random()+cat.text} className="profileCard_Label" style={{background:getColor(cat.text)}} horizontal>{profile.categories.length<3 ? cat.text: cat.text.charAt(0).toUpperCase()}</Label>
        )))}
      </div>
     
      <Card.Content className="profileCard_Content">
        <Card.Header className="profileHeader_Name" style={{textAlign:"center"}}>{profile.displayName}</Card.Header>
       {profile.title ? <div className="ellipsis" style={{textAlign:"center", marginBottom:"5px"}}>{profile.title}</div>
       : <div style={{textAlign:"center", marginBottom:"5px"}}>...</div>}
        {/* <div style={{textAlign:"center", marginBottom:"15px"}}>
          {profile.hasPhoneNumber && <Icon name="phone" color="green" /> }
          <Icon name="envelope" style={{color:"#263a5e"}} />
        </div> */}
        <Card.Description key={profile.userName+Math.random()+"desc"} className='profileListItem_CardDescription'>
        <Popup
         hoverable
         position="top center"
         on={['hover', 'click']}
         positionFixed 
        content={profile.subCategories && profile.subCategories.length> 0 ?
          profile.subCategories.map<React.ReactNode>(s => <span key={profile.userName+Math.random()+"subspan"}>{s.text}</span>).reduce((prev, cur) => [prev, ', ', cur])
          : "Bilgi yok"}
        key={profile.userName+Math.random()+"subPopover"}
        trigger={ <div key={profile.userName+Math.random()+"sub"} className=" ellipsis">
           
        {profile.subCategories && profile.subCategories.length> 0 ?
        profile.subCategories.map<React.ReactNode>(s => <span key={profile.userName+Math.random()+"subspan"}>{s.text}</span>).reduce((prev, cur) => [prev, ', ', cur])
        : "Bilgi yok"
      }
        </div>}
      />
          {profile.city ?  <div style={{textAlign:"center", marginBottom:"5px"}}>
            <Icon name="map marker alternate" />{profile.city.text}, Türkiye</div> :
         <div style={{textAlign:"center", marginBottom:"5px"}}>Şehir belirtilmemiş</div> }
         <Button  onClick={handleCardClick} size="small" className='gradientBtn' circular content="Profili Gör" />
            {/* <Popup
             hoverable
             position="top center"
             on={['hover', 'click']}
             positionFixed 
        content={profile.accessibilities && profile.accessibilities.length > 0 ? 
     
          profile.accessibilities.map<React.ReactNode>(s =>
             <span 
             key={profile.userName+Math.random() +"_accessibility"} 
             id={profile.userName+Math.random() +"_accessibility"}>{s.text}
             </span>).reduce((prev, cur) => [prev, ',', cur])
              : "Bilgi yok"}
        key={profile.userName+Math.random() +"_accessibilityPopover"}
        trigger={
          <div key={profile.userName+Math.random()+"acc"} className="profileListItem_subCats"> <Icon key={profile.userName+Math.random()+"accIcon"} name="bolt" /> 
          Erişim:
          {profile.accessibilities && profile.accessibilities.length > 0 ? 
     
     profile.accessibilities.map<React.ReactNode>(s =>
        <span 
        key={profile.userName+Math.random() +"_accessibility"} 
        id={profile.userName+Math.random() +"_accessibility"}>{s.text}
        </span>).reduce((prev, cur) => [prev, ',', cur])
         : "Bilgi yok"}  </div> 
        }
      />
            
            <div className="profileListItem_subCats"> <Icon name="spinner" /> {profile.experienceYear > 0 ? profile.experienceYear +"yıl tecrübe" : "" } </div>  */}

        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row className="profileCard_footer">
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'small'} count={profile.starCount} showCount/>
          </Grid.Column> 
          <Grid.Column className="followerCountColumn">
          <Icon name="heart outline" />
          {profile.followerCount}
          </Grid.Column>  
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

 export default observer(ProfileListItem);
