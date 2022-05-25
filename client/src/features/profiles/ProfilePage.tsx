import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Container, Grid, Header, Icon, Image, Label, Segment, Statistic } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent'
import { ProfileFormValues } from '../../app/models/profile'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileBlogPlaceHolder from './ProfileBlogPlaceHolder'
import ProfileBlogs from './ProfileBlogs'
import ProfileCommentPlaceHolder from './ProfileCommentPlaceHolder'
import ProfileComments from './ProfileComments'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'
import ProfileMessage from './ProfileMessage'
import  ProfileReferances  from './ProfileReferances'
import { ProfileRefPlaceholder } from './ProfileRefPlaceholder'
import { history } from '../../';
import {Button, ButtonGroup, Reveal} from 'semantic-ui-react';
import ProfileVideo from './ProfileVideo'
import { useMediaQuery } from 'react-responsive'

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({match}) => {

    const rootStore = useContext(RootStoreContext);
    const {setProfileNull,loadingProfile, loadProfile, loadingBlogs, loadingComments, loadingReferencePics, profile, follow,
         unfollow, isCurrentUser, loading,setActiveTab, setProfileForm, referencePics} = rootStore.profileStore;
    const {isLoggedIn } = rootStore.userStore;

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

    useEffect(() => {
       
        loadProfile(match.params.username)
        .then((profile) => 
        {   
            setProfileForm(new ProfileFormValues(profile!))}
            )
        setActiveTab(0);
    

    return () => {
        setProfileNull();
    }
    }, [match.params.username])



    if(loadingProfile && profile === null) 
    return <LoadingComponent content='Uzman yükleniyor...' />

    return (
      <Container className="pageContainer">

        {profile===null || profile!.userName !== match.params.username ? (<LoadingComponent content='Uzman yükleniyor...' />) :
       (
         <>
        <Grid stackable className='profilePage_header-grid'>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} follow={follow} unfollow={unfollow} loading={loading} />
            </Grid.Column>
            </Grid>
            <Grid stackable className="profilePage_Container_Grid_mobile">
            <Grid.Column width={isMobile?"16" :"11"} style={{marginTop:"40px"}}>
            {isMobile && (isCurrentUser && profile.role === "WaitingTrainer" && 
          <ButtonGroup widths={2}>
            <Button
              className='blueBtn'
              content={'Uzman Başvuruma Git'}
              onClick={()=> history.push(`/TrainerApplication/${profile.userName}`)}
            />
          </ButtonGroup>)
          }
                  <ProfileContent profile={profile!} setActiveTab={setActiveTab}/>   

          {isMobile && (profile!.role === "Trainer" && 
              (
                <>
                <Header className='contentHeader'><Icon name="film"></Icon> Tanıtım Videosu </Header>
                   <ProfileVideo videoUrl={profile!.videoUrl}/> 
                 </>
              ))
            }

              {isMobile && ((loadingReferencePics || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  
              <ProfileRefPlaceholder />: 
              ( profile!.role === "Trainer" && <ProfileReferances referencePics={referencePics}/> ))
              }
                 
                  {isMobile && (!isCurrentUser && profile!.role === "Trainer" && 
                <ProfileMessage profile={profile!}/> )
            }
               
                {(loadingBlogs || profile!.userName !== match.params.username) && profile!.role === "Trainer"  ?   
                <ProfileBlogPlaceHolder />:
                 ( profile!.role === "Trainer" && <ProfileBlogs />)}
                
                {(loadingComments || profile!.userName !== match.params.username) && profile!.role === "Trainer" ? 
                 <ProfileCommentPlaceHolder />: 
                 ( profile!.role === "Trainer" && <ProfileComments /> )}
               
           </Grid.Column>
           <Grid.Column width={isMobile?"16":"5"} style={{marginTop:"40px"}}>
           {!isMobile && (isCurrentUser && profile.role === "WaitingTrainer" && 
          <ButtonGroup widths={2}>
            <Button
              className='blueBtn'
              content={'Uzman Başvuruma Git'}
              onClick={()=> history.push(`/TrainerApplication/${profile.userName}`)}
            />
          </ButtonGroup>)
          }
            
            {!isMobile && (!isCurrentUser && profile!.role === "Trainer" && 
                <ProfileMessage profile={profile!}/> )
            }
            
            {
             !isMobile && ( profile!.role === "Trainer" && 
              (
                <>
                <Header className='contentHeader'><Icon name="film"></Icon> Tanıtım Videosu </Header>
                   <ProfileVideo videoUrl={profile!.videoUrl}/> 
                 </>
              ))
            }

              {!isMobile && ((loadingReferencePics || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  
              <ProfileRefPlaceholder />: 
              ( profile!.role === "Trainer" && <ProfileReferances referencePics={referencePics}/> ))}


            </Grid.Column>
            </Grid>
           
          </>
           
        
         )}
         <br></br>
      <br></br>
        </Container>
    )
}

export default observer(ProfilePage);
