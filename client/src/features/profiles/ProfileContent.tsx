import React, { useContext } from 'react'
import {Button, ButtonGroup, Icon, Label, Menu, Reveal, Tab} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
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
            {menuItem: (
                <Menu.Item key='about'>
                 <Icon size="large" name="id card outline"></Icon>Hakkında
                </Menu.Item>
              ) , render:() => <ProfileDescription />},
            {menuItem: (
                <Menu.Item key='photos'>
                 <Icon size="large" name="images outline"></Icon>Fotoğraflar
                </Menu.Item>
              ) , render:() => <ProfilePhotos />},

            {menuItem: (
                <Menu.Item key='activities'>
                 <Icon size="large" name="calendar check outline"></Icon>Aktiviteler
                </Menu.Item>
              ) , render:() => <ProfileActivities />},

            {menuItem: (
                <Menu.Item key='following'>
                  <Icon size="large" name="users"></Icon>Takip Ettikleri<Label>{profile.followingCount}</Label>
                </Menu.Item>
              ) , render:() => <ProfileFollowings />},
           
           {menuItem:  <Menu.Item key='follower'>
           <Icon size="large" name="users"></Icon> Takipçileri<Label>{profile.followerCount}</Label>
          </Menu.Item> , render:() => <ProfileFollowings />},
        
        ]
    }else 
    return panes = [
        {menuItem: (
            <Menu.Item key='photos'>
             <Icon size="large" name="images outline"></Icon>Fotoğraflar
            </Menu.Item>
          ) , render:() => <ProfilePhotos />},

        {menuItem: (
            <Menu.Item key='activities'>
             <Icon size="large" name="calendar check outline"></Icon>Aktiviteler
            </Menu.Item>
          ) , render:() => <ProfileActivities />},

        {menuItem: (
            <Menu.Item key='following'>
              <Icon size="large" name="users"></Icon>Takip Ettikleri<Label>{profile.followingCount}</Label>
            </Menu.Item>
          ) , render:() => <ProfileFollowings />},
       
       {menuItem:  <Menu.Item key='follower'>
       <Icon size="large" name="users"></Icon> Takipçileri<Label>{profile.followerCount}</Label>
      </Menu.Item> , render:() => <ProfileFollowings />},
    ]

}


const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>,
    },
    {
      menuItem: (
        <Menu.Item key='messages'>
          Messages<Label>15</Label>
        </Menu.Item>
      ),
      render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
    },
  ]

const ProfileContent: React.FC<IProps> = ({setActiveTab, profile}) => {
    const rootStore = useContext(RootStoreContext);

    const {setProfileNull,loadingProfile, loadProfile, loadingBlogs, loadingComments, follow,
        unfollow, isCurrentUser, loading, setProfileForm} = rootStore.profileStore;

    return (
        <>
       <Tab 
        //    menu={{fluid:true, vertical:true}}
        //    menuPosition='right'
           menu={{ secondary: true, pointing: true, className:"profilemenu_tab" }}
           panes={getPanes(profile)}
           onTabChange={(e, data) => setActiveTab(data.activeIndex)}
       />
       
       </>
    )
}

export default ProfileContent