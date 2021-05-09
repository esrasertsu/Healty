import React, { useContext, useState } from 'react';
import { Menu, Container, Image, Dropdown } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import SearchArea from '../home/SearchArea';

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout} = rootStore.userStore;
    const { activeMenu,setActiveMenu } = rootStore.commonStore;
   
    const fixed = "top";
    return (
      <>
      <Menu 
      fixed={fixed ? 'top' : undefined}
      pointing
      secondary
      size='massive'
       >
       <Container>
       <Menu.Item as='a' header  
        onClick={() => {
          setActiveMenu(-1);
            history.push(`/`);
          }}
          >
                <div style={{display:"flex", alignItems:"center"}}>
                  <img
                      src="/assets/logo.png"
                      alt="logo"
                      style={{ height:"30px"}}
                    />
                </div>
                  
                  </Menu.Item>
                  <Menu.Item>
                    <SearchArea className="nav_SearchArea" placeholder="Kategori ara"/>
                  </Menu.Item>
                  <Menu.Item position="right" as={Link} to="/profiles"  name="Eğitmenler" 
                  active={activeMenu === 0}
                onClick={() => {
                   //setLoadingProfiles(true);
                   setActiveMenu(0);
                  //  history.push(`/profiles`);
                    }} /> 
               <Menu.Item as={Link} to="/activities" name="Aktiviteler"
                active={activeMenu === 1}
                  onClick={() => {
                 //   setLoadingInitial(true);
                    setActiveMenu(1)
                   // history.push(`/activities`);
                    }} />

                
          <Menu.Item as={Link} to="/blog" name="Blog" 
           active={activeMenu === 2}
             onClick={() => {
                 //  setLoadingPosts(true);
                   // history.push(`/blog`);
                    setActiveMenu(2)
                    }} />

          {user && (
            <Menu.Item as='a'>
              <Image avatar spaced="right" src={user.image || "/assets/user.png"} />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${user.userName}`}
                    text="My profile"
                    icon="user"
                  />
                  <Dropdown.Item text="Logout" onClick={logout} icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
         </Container>         
       
      </Menu>
{/* 
<Menu fixed="left" vertical>

<Menu.Item header  
 onClick={() => {
  setActiveMenu(-1);
    history.push(`/`);
  }}
  >
        <div style={{display:"flex", alignItems:"center"}}>
           <img
              src="/assets/logo512.png"
              alt="logo"
              style={{ height:"45px"}}
               
            />
            Reactivity
        </div>
           
          </Menu.Item>
          <Container style={{marginTop:"100px"}}>    
          <Menu.Item name="News Feed"  
          active={activeMenu===0}
           onClick={() => {
            setActiveMenu(0);
            if(activeMenu!==0)
            {
              setLoadingInitial(true);
              history.push(`/profile/seyma`);
            } 
            
            }} />
              <Menu.Item name="Trainers"   
              active={activeMenu===1}
              onClick={() => {
                setActiveMenu(1);
                if(activeMenu!==1)
                {
                  setLoadingInitial(true);
                  history.push(`/activitysearch`);
                }
            }} />    
            <Menu.Item name="activities" 
             active={activeMenu===2}
            onClick={() => {
              setActiveMenu(2);
              if(activeMenu!==2)
              {
                setLoadingInitial(true);
                history.push(`/activities`);
              }
            }} />

        <Menu.Item name="profiles" 
        active={activeMenu===3}
        onClick={() => {
          setActiveMenu(3);
          if(activeMenu!==3)
          {
            setLoadingProfiles(true);
            history.push(`/profiles`);
          }
            }} /> */}

        {/* {user && user.role !== "User" &&
        <>
            <Menu.Item>
                <Button
                    as={NavLink}
                    to="/createActivity"
                    positive
                    content="Create Activity"
                />
            </Menu.Item>
             <Menu.Item>
             <Button
                 as={NavLink}
                 to="/createPost"
                 positive
                 content="Create Post"
             />
         </Menu.Item>
         </>
        } */}
{/*   
  {user && (
    <Menu.Item position="right">
      <Image avatar spaced="right" src={user.image || "/assets/user.png"} />
      <Dropdown pointing="top left" text={user.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to={`/profile/${user.userName}`}
            text="My profile"
            icon="user"
          />
          <Dropdown.Item text="Logout" onClick={logout} icon="power" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )} */}
{/* </Container>
</Menu> */}
</>
    );
}

export default observer(NavBar);