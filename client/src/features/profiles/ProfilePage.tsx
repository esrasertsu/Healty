import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid, Header, Icon, Label, Statistic } from 'semantic-ui-react'
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
    const {setProfileNull,loadingProfile, loadProfile, loadingBlogs, loadingComments, profile, follow,
         unfollow, isCurrentUser, loading,setActiveTab, setProfileForm} = rootStore.profileStore;

    useEffect(() => {
        if(profile)
       { 
        
           loadProfile(match.params.username)
        .then((profile) => 
        {   
            setProfileForm(new ProfileFormValues(profile!))}
            )
        setActiveTab(0);
    }else {
        loadProfile(match.params.username)
        .then((profile) => 
        {   
            setProfileForm(new ProfileFormValues(profile!))}
            )
        setActiveTab(0);
    }

    return () => {
        setProfileNull();
    }
    }, [loadProfile,match,setActiveTab,setProfileForm])



    if(loadingProfile && profile === null) 
    return <LoadingComponent content='Loading profile...' />

    return (
        <>
        {profile===null || profile!.userName !== match.params.username ? (<LoadingComponent content='Loading profile...' />) :
       (
        <Grid stackable>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} follow={follow} unfollow={unfollow} loading={loading} />
            </Grid.Column>
            <Grid.Column width={11} style={{marginTop:"40px"}}>
                  <ProfileContent profile={profile!} setActiveTab={setActiveTab}/>   
                  {(loadingComments || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  <ProfileRefPlaceholder />: ( profile!.role === "Trainer" && <ProfileReferances /> )}
                {(loadingBlogs || profile!.userName !== match.params.username) && profile!.role === "Trainer"  ?   <ProfileBlogPlaceHolder />: ( profile!.role === "Trainer" && <ProfileBlogs />)}
                {(loadingComments || profile!.userName !== match.params.username) && profile!.role === "Trainer" ?  <ProfileCommentPlaceHolder />: ( profile!.role === "Trainer" && <ProfileComments /> )}
                 
           </Grid.Column>
           <Grid.Column width={5} style={{marginTop:"40px"}}>
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
            
            </Grid.Column>
           
          
            {/* <Grid.Row>
                <Grid.Column width={11} >
                <ProfileComments />
                </Grid.Column>
            </Grid.Row> */}
        </Grid>
         )}
         <br></br>
      <br></br>
        </>
    )
}

export default observer(ProfilePage);
