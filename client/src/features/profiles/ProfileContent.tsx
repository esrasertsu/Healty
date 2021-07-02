import React from 'react'
import {Tab} from 'semantic-ui-react';
import ProfileActivities from './ProfileActivities';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos  from './ProfilePhotos';

interface IProps{
    setActiveTab: (activeIndex:any) => void;
}
const panes = [
    {menuItem: 'Hakkında', render:() => <ProfileDescription  />},
    {menuItem: 'Fotoğraflar', render:() => <ProfilePhotos />},
    {menuItem: 'Etkinlikler', render:() => <ProfileActivities/>},
    {menuItem: 'Takip Edilenler', render:() => <ProfileFollowings />},
    {menuItem: 'Takipçiler', render:() => <ProfileFollowings />},

]

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
    return (
       <Tab 
        //    menu={{fluid:true, vertical:true}}
        //    menuPosition='right'
           menu={{ secondary: true, pointing: true }}
           panes={panes}
           onTabChange={(e, data) => setActiveTab(data.activeIndex)}
       />
    )
}

export default ProfileContent