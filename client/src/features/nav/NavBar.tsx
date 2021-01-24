import React, { useContext, useState } from 'react';
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout} = rootStore.userStore;
    const { setLoadingProfiles } = rootStore.profileStore;
    const { setLoadingInitial } = rootStore.activityStore;

    const [activeMenu, setActiveMenu] = useState(0);
    return (
      <>
      <Menu fixed="top" pointing secondary>
               {/* <Menu.Item name="activities"   onClick={() => {
                   setLoadingInitial(true);
                    history.push(`/activities`);
                    }} />

                <Menu.Item name="profiles" 
                onClick={() => {
                   setLoadingProfiles(true);
                    history.push(`/profiles`);
                    }} /> 
                {user && user.role !== "User" &&
                    <Menu.Item>
                        <Button
                            as={NavLink}
                            to="/createActivity"
                            positive
                            content="Create Activity"
                        />
                    </Menu.Item>
                }
          */}

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
          )}
      </Menu>

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
            }} />

        {user && user.role !== "User" &&
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
        }
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
</Container>
</Menu>
</>
    );
}

export default observer(NavBar);