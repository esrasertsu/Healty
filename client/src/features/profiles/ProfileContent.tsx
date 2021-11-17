import React, { useContext } from 'react'
import {Button, ButtonGroup, Icon, Label, Menu, Tab} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileActivities from './ProfileActivities';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos  from './ProfilePhotos';
import { useMediaQuery } from 'react-responsive'


interface IProps{
    setActiveTab: (activeIndex:any) => void;
    profile: IProfile;
}


const getPanes = (profile:IProfile,isTabletOrMobile:boolean) => {
    
    let panes = [];

    if(profile.role === "Trainer")
    {
        return panes = [
            {menuItem: (
                <Menu.Item key='about'>
                 <Icon size="large" name="id card outline"></Icon>
                {!isTabletOrMobile && "Hakkında"}  
                </Menu.Item>
              ) , render:() => <ProfileDescription />},
            {menuItem: (
                <Menu.Item key='photos'>
                 <Icon size="large" name="images outline"></Icon>
                 {!isTabletOrMobile && "Fotoğraflar"}
                </Menu.Item>
              ) , render:() => <ProfilePhotos />},

            {menuItem: (
                <Menu.Item key='activities'>
                 <Icon size="large" name="calendar check outline"></Icon>
                 {!isTabletOrMobile && "Aktiviteler"}
                </Menu.Item>
              ) , render:() => <ProfileActivities />},

            {menuItem: (
                <Menu.Item key='following'>
                  <Icon size="large" name="users"></Icon>
                  {!isTabletOrMobile && <> Takip Ettikleri <Label>{profile.followingCount}</Label> </> }
                </Menu.Item>
              ) , render:() => <ProfileFollowings />},
           
           {menuItem:  <Menu.Item key='follower'>
           <Icon size="large" name="users"></Icon> 
           {!isTabletOrMobile && <>  Takipçileri<Label>{profile.followerCount}</Label> </> }
          </Menu.Item> , render:() => <ProfileFollowings />},
        
        ]
    }else 
    return panes = [
        {menuItem: (
            <Menu.Item key='photos'>
             <Icon size="large" name="images outline"></Icon>
             {!isTabletOrMobile && "Fotoğraflar" }
            </Menu.Item>
          ) , render:() => <ProfilePhotos />},

        {menuItem: (
            <Menu.Item key='activities'>
             <Icon size="large" name="calendar check outline"></Icon>
             {!isTabletOrMobile &&  "Aktiviteler" }
            </Menu.Item>
          ) , render:() => <ProfileActivities />},

        {menuItem: (
            <Menu.Item key='following'>
              <Icon size="large" name="users"></Icon>
              {!isTabletOrMobile &&  <> Takip Ettikleri<Label>{profile.followingCount}</Label></> }
            </Menu.Item>
          ) , render:() => <ProfileFollowings />},
       
       {menuItem:  <Menu.Item key='follower'>
       <Icon size="large" name="users"></Icon> 
       {!isTabletOrMobile &&  <>  Takipçileri<Label>{profile.followerCount}</Label></> }
      </Menu.Item> , render:() => <ProfileFollowings />},
    ]

}



const ProfileContent: React.FC<IProps> = ({setActiveTab, profile}) => {
    const rootStore = useContext(RootStoreContext);

        const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

    return (
        <>
       <Tab 
        //    menu={{fluid:true, vertical:true}}
        //    menuPosition='right'
           menu={{ secondary: true, pointing: true, className:"profilemenu_tab" }}
           panes={getPanes(profile,isTabletOrMobile)}
           onTabChange={(e, data) => setActiveTab(data.activeIndex)}
       />
       
       </>
    )
}

export default ProfileContent