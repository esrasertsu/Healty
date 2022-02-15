import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button, Grid, Header, Icon, Image, Label, Modal, Segment, Tab } from 'semantic-ui-react';
import { history } from '../..';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';
import { IProfile } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';


const SavedProfiles = () => {

    const rootStore = useContext(RootStoreContext);
    const { getSavedProfiles, loading ,followings,follow,unfollow} = rootStore.profileStore;
    const {isLoggedIn} = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' })
    const { user } = rootStore.userStore;

    useEffect(() => {
        getSavedProfiles();
    }, []);


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

  return (
    <Tab.Pane attached={false} loading={loading}> 
     <Grid columns={2} stackable>
     {
        followings.map((pro) => (
           
               
                    <Grid.Column>
                    <Segment key={"savedProfile_segment_"+ pro.id}>

                    <Grid>
                        <Grid.Row>
                        <Grid.Column width={4}>
                            <Image
                            key={"savedProfiles_img_" + pro.id}
                            circular size="tiny"
                            className='savedProfiles_img'
                            src={pro.image || '/assets/user.png'} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                             <Header style={{marginBottom:"7px"}}>
                                {pro.displayName}
                            </Header>
                            <div>
                                {pro.title}
                            </div>
                            <div className="savedProfile ellipsis">   
                            {pro.subCategories && pro.subCategories.length> 0 ?
                            pro.subCategories.map<React.ReactNode>(s => <span key={pro.userName+Math.random()+"subspan"}>{s.text}</span>).reduce((prev, cur) => [prev, ', ', cur])
                            :"Bilgi yok"}
                             </div>
                             <StarRating rating={pro.star} editing={false} size={'small'} count={pro.starCount} showCount/>
                           
                        </Grid.Column>
                        <Grid.Column width={4}>
                        <div className='savedProfile_lastcolumn'>
                            <div>
                            <Icon 
                            className='profileListItem_addToFav' 
                            name={pro.isFollowing?"heart" :"heart outline"}  
                            color={pro.isFollowing?"red" :undefined}
                            onClick={() => pro.isFollowing ? handleUnfollowTrainer(pro.userName,pro) :handleFollowTrainer(pro.userName, pro) } />
                            </div>
                       
                       {!isMobile && <Button size='tiny' circular content="İncele" className='gradientBtn'
                          onClick={()=> history.push(`/profile/${pro.userName}`)} />}
                        </div>
                        </Grid.Column>
                        </Grid.Row>
                        {isMobile && <Grid.Row style={{paddingTop:"0"}}>
                            <Grid.Column width={4}>

                            </Grid.Column>
                            <Grid.Column width={12}>
                                     <Button
                                     style={{padding:"8px"}}
                                     fluid size='mini' circular content="İncele" className='gradientBtn'
                                     onClick={()=> history.push(`/profile/${pro.userName}`)} />
                           </Grid.Column>
                        </Grid.Row>}
                     </Grid>  
                         </Segment>
                    </Grid.Column>
              
                    
           
            ))
        }
                   
                   </Grid>
        </Tab.Pane>
  );
};


export default observer(SavedProfiles)