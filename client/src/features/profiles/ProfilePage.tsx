import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({match}) => {

    const rootStore = useContext(RootStoreContext);
    const {loadingProfile, loadProfile, profile, follow, unfollow, isCurrentUser, loading,setActiveTab} = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username);
        setActiveTab(0);
    }, [loadProfile,match,setActiveTab])

    if(loadingProfile) 
    return <LoadingComponent content='Loading profile...' />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} follow={follow} unfollow={unfollow} loading={loading} />
                <ProfileContent setActiveTab={setActiveTab}/>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage);
