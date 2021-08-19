import React, { useContext } from 'react';
import { Card, Image, Icon, Grid, Label, Modal} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';
import { observer } from 'mobx-react-lite';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';

interface IProps {
    profile: IProfile,
    popular?: boolean
}

 const ProfileListItem: React.FC<IProps> = ({profile,popular}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile} = rootStore.profileStore;
  const {isLoggedIn} = rootStore.userStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;


  const getColor = (catName:string) =>{
    let index = colors.findIndex(x => x.key === catName);
    return colors[index].value;
  }

  const handleRegisterClick = (e:any,str:string) => {
    
    e.stopPropagation();
    if(modal.open) closeModal();

        openModal("Üye Kaydı", <>
        <Image size='large' src='/assets/Login1.png' wrapped />
        <Modal.Description>
        <RegisterForm location={str} />
        </Modal.Description>
        </>,true,
        <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={() => handleLoginClick(e,str)}>Giriş</span></p>) 
    }

    const handleLoginClick = (e:any,str:string) => {
      e.stopPropagation();
      if(modal.open) closeModal();

          openModal("Giriş Yap", <>
          <Image size='large' src='/assets/Login1.png' wrapped />
          <Modal.Description>
          <LoginForm location={str} />
          </Modal.Description>
          </>,true,
           <p>Üye olmak için <span className="registerLoginAnchor" onClick={() => handleRegisterClick(e,str)}>tıklayınız</span></p>) 
      }


  const handleCardClick = (e:any) => {
    debugger;
    e.stopPropagation() ;
        if(!isLoggedIn)
    {    var str = `/profile/${profile.userName}`;
         handleLoginClick(e,str);
    }
    else
    {
      setLoadingProfile(true);
      history.push(`/profile/${profile.userName}`)
    }
      
}
  return (
    <Card onClick={handleCardClick}
      style={{height:"100%"}}
      key={profile.userName+Math.random()} >
      <Image circular src={profile.image || '/assets/user.png'} />
      <div className="profileListItem_badges">   
      {(profile.categories && profile.categories.map((cat) => (
          <Label key={profile.userName+Math.random()+cat.text} className="profileCard_Label" style={{background:getColor(cat.text)}} horizontal>{profile.categories.length<3 ? cat.text: cat.text.charAt(0).toUpperCase()}</Label>
        )))}
      </div>
     
      <Card.Content className="profileCard_Content">
        <Card.Header className="profileHeader_Name" style={{textAlign:"center"}}>{profile.displayName}</Card.Header>
       {profile.title &&  <div style={{textAlign:"center", marginBottom:"5px"}}>{profile.title}</div>}
        <div style={{textAlign:"center", marginBottom:"15px"}}>
          {profile.hasPhoneNumber && <Icon name="phone" color="green" /> }
          <Icon name="envelope" style={{color:"#263a5e"}} />
        </div>
        <Card.Description key={profile.userName+Math.random()+"desc"}>
          <div key={profile.userName+Math.random()+"sub"} className=" ellipsis">
           
            {profile.subCategories && profile.subCategories.length> 0 ?
            profile.subCategories.map<React.ReactNode>(s => <span key={profile.userName+Math.random()+"subspan"}>{s.text}</span>).reduce((prev, cur) => [prev, ', ', cur])
            : "Bilgi yok"
          }
            </div>
            {/* <div key={profile.userName+Math.random()+"acc"} className="profileListItem_subCats"> <Icon key={profile.userName+Math.random()+"accIcon"} name="bolt" /> {profile.accessibilities && profile.accessibilities.length > 0 ? 
          profile.accessibilities.map<React.ReactNode>(s => <span key={profile.userName+Math.random() +"_accessibility"} id={profile.userName+Math.random() +"_accessibility"}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
            : "Bilgi yok"}  </div> 
            <div className="profileListItem_subCats"> <Icon name="spinner" /> {profile.experienceYear > 0 ? profile.experienceYear +"yıl tecrübe" : "" } </div> 
*/}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row className="profileCard_footer">
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'small'} count={profile.starCount} showCount/>
          </Grid.Column> 
          <Grid.Column className="followerCountColumn">
          <Icon name='user' />
          {profile.followerCount}
          </Grid.Column>  
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

 export default observer(ProfileListItem);
