import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileBlogPlaceHolder from './ProfileBlogPlaceHolder'
import ProfileBlogs from './ProfileBlogs'
import ProfileCommentPlaceHolder from './ProfileCommentPlaceHolder'
import ProfileComments from './ProfileComments'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'
import ProfileMessage from './ProfileMessage'

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({match}) => {
debugger;
    const rootStore = useContext(RootStoreContext);
    const {loadingProfile, loadProfile, loadingBlogs, loadingComments, profile, follow, unfollow, isCurrentUser, loading,setActiveTab} = rootStore.profileStore;
    useEffect(() => {
        loadProfile(match.params.username);
        setActiveTab(0);
    }, [loadProfile,match,setActiveTab])

    if(loadingProfile) 
    return <LoadingComponent content='Loading profile...' />

    return (
        <>
        {profile!.userName !== match.params.username ? (<LoadingComponent content='Loading profile...' />) :
       (
        <Grid stackable>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} follow={follow} unfollow={unfollow} loading={loading} />
            </Grid.Column>
            <Grid.Column width={11}>
                <ProfileContent setActiveTab={setActiveTab}/>
                {loadingBlogs || profile!.userName !== match.params.username ?   <ProfileBlogPlaceHolder />: <ProfileBlogs />}
                {loadingComments || profile!.userName !== match.params.username ?  <ProfileCommentPlaceHolder />: <ProfileComments /> }
            </Grid.Column>
            <Grid.Column width={5} >
            {!isCurrentUser &&
                <ProfileMessage profile={profile!}/> 
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
