import React, { useContext } from 'react';
import { Menu, Container, Image, Dropdown, Label, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import NavSearchArea from './NavSearchArea';
import { useMediaQuery } from 'react-responsive'


interface IProps{
    setVisibleMobileNav:(visible:boolean) => void;
    visible:boolean;
}

const MobileNavBar: React.FC<IProps> = ({setVisibleMobileNav,visible}) => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout} = rootStore.userStore;
    const { activeMenu,setActiveMenu } = rootStore.commonStore;
    const { notificationCount } = rootStore.userStore;
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const fixed = "top";
    return (
      <>
      {
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
          setVisibleMobileNav(false);
            history.push(`/`);
          }}
          >
                <div style={{display:"flex", alignItems:"center"}}>
                  <img
                      src="/assets/logo.png"
                      alt="logo"
                      style={{ height:"40px"}}
                    />
                </div>
                  
                  </Menu.Item>
                 {!isMobile && 
                 <Menu.Item>
                   <NavSearchArea />
                 </Menu.Item>
                 } 
                  <Menu.Item position="right" 
                  icon={"bars"}
                  className="mobileNavMenuButton"
                  active={activeMenu === -2}
                onClick={() => {
                activeMenu !== -2 ? setActiveMenu(-2) :
                   setActiveMenu(-2);
                   setVisibleMobileNav(!visible);
                    }} /> 
              
         </Container>         
       
      </Menu>
}

</>
    );
}

export default observer(MobileNavBar);