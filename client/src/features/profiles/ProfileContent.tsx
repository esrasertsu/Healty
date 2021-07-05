import React from 'react'
import {Tab} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import ProfileActivities from './ProfileActivities';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos  from './ProfilePhotos';

interface IProps{
    setActiveTab: (activeIndex:any) => void;
    profile: IProfile;
}


const getPanes = (profile:IProfile) => {

    let panes = [];

    if(profile.role === "Trainer")
    {
        return panes = [
            {menuItem: 'Hakkında', render:() =>   <ProfileDescription  />},
            {menuItem: 'Uzman Fotoğrafları', render:() => <ProfilePhotos />},
            {menuItem: 'Etkinlikler', render:() => <ProfileActivities/>},
            {menuItem: `Takip Edilenler (${profile.followingCount})`, render:() => <ProfileFollowings />},
            {menuItem: `Takipçiler (${profile.followerCount})`, render:() => <ProfileFollowings />},
        
        ]
    }else 
    return panes = [
        {menuItem: 'Fotoğraflar', render:() => <ProfilePhotos />},
        {menuItem: 'Etkinlikler', render:() => <ProfileActivities/>},
        {menuItem: `Takip Edilenler (${profile.followingCount})`, render:() => <ProfileFollowings />},
        {menuItem: `Takipçiler (${profile.followerCount})`, render:() => <ProfileFollowings />},
    ]

}

const ProfileContent: React.FC<IProps> = ({setActiveTab, profile}) => {
    return (
       <Tab 
        //    menu={{fluid:true, vertical:true}}
        //    menuPosition='right'
           menu={{ secondary: true, pointing: true }}
           panes={getPanes(profile)}
           onTabChange={(e, data) => setActiveTab(data.activeIndex)}
       />
    )
}

export default ProfileContent