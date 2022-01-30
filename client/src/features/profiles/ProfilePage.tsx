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

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({match}) => {

    const rootStore = useContext(RootStoreContext);
    const {setProfileNull,loadingProfile, loadProfile, loadingBlogs, loadingComments, loadingReferencePics, profile, follow,
         unfollow, isCurrentUser, loading,setActiveTab, setProfileForm, referencePics} = rootStore.profileStore;
    const {isLoggedIn } = rootStore.userStore;
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
        <Grid stackable>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} follow={follow} unfollow={unfollow} loading={loading} />
            </Grid.Column>
            </Grid>
            <Grid stackable className="profilePage_Container_Grid_mobile">
            <Grid.Column width={11} style={{marginTop:"40px"}}>
                  <ProfileContent profile={profile!} setActiveTab={setActiveTab}/>   
                {(loadingBlogs || profile!.userName !== match.params.username) && profile!.role === "Trainer"  ?   <ProfileBlogPlaceHolder />: ( profile!.role === "Trainer" && <ProfileBlogs />)}
                {(loadingComments || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  <ProfileCommentPlaceHolder />: ( profile!.role === "Trainer" && <ProfileComments /> )}
                 
           </Grid.Column>
           <Grid.Column width={5} style={{marginTop:"40px"}}>
           {isCurrentUser && profile.role === "WaitingTrainer" &&
          <ButtonGroup widths={2}>
            <Button
              color={'blue'}
              content={'Uzman Başvuruma Git'}
              onClick={()=> history.push(`/trainerRegister/${profile.userName}`)}
            />
          </ButtonGroup>
          }
            {isCurrentUser && profile.role === "Trainer" &&
          <ButtonGroup widths={2}>
            <Button
              basic
              color={'green'}
              content={'Blog Yaz'}
              onClick={()=> history.push('/createPost')}
            />
            <Button
            basic
            color={'blue'}
            content={'Aktivite Oluştur'}
            onClick={()=> history.push('/createActivity')}
          />
          </ButtonGroup>
          }
          {!isCurrentUser && 
          <div className="ui pointing secondary menu" style={{height:"75px", alignItems:"center"}}>
          <Reveal animated='move' style={{width:"100%"}}>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                fluid
                className="followingButtonOut"
                content={profile.isFollowing ? 'Takip Ediliyor' : 'Takip Edilmiyor'}
                icon="hand pointer"
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                loading={loading}
                fluid
                className={profile.isFollowing ? 'followingButtonOut_redClassName' : 'followingButtonOut_greenClassName'}
                content={profile.isFollowing ? 'Takipten Çık' : 'Takip Et'}
                disabled={!isLoggedIn}
                onClick={profile.isFollowing ? () => unfollow(profile.userName): () => follow(profile.userName)}
              />
            </Reveal.Content>
          </Reveal>
          </div> }
          
            {!isCurrentUser && profile!.role === "Trainer" &&
                <ProfileMessage profile={profile!}/> 
            }
            
            {
              profile!.role === "Trainer" &&
              (
                <>
                <Header><Icon name="film"></Icon> Tanıtım Videosu 
                  
            </Header>
                          <ProfileVideo videoUrl={profile!.videoUrl}/> 
                          </>

              )
            }

{isCurrentUser && profile!.role === "Trainer" &&
                <Segment className="profileMessageSegment">
                <Grid container className="profileMessageGrid" stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={5}>
                            <Image circular size={'tiny'} src={profile.image || '/assets/user.png'}
                            onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}></Image>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Header>{profile.displayName}</Header>
                            <Label><Icon name="mail outline"></Icon> Yanıtlama oranı %{profile.responseRate}&nbsp;
                                {/* <Icon size="large" name="question circle" className="questionmarkicon"></Icon> */}
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
       </Segment>
            }


{(loadingReferencePics || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  <ProfileRefPlaceholder />: ( profile!.role === "Trainer" && <ProfileReferances referencePics={referencePics}/> )}

            
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
