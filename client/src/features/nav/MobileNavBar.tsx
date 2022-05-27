import React, { useContext } from 'react';
import { Menu, Container, Image, Dropdown, Label, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import NavSearchArea from './NavSearchArea';
import { useMediaQuery } from 'react-responsive'


interface IProps{
    setVisibleMobileNav:(visible:boolean) => void;
    visible:boolean;

}

const MobileNavBar: React.FC<IProps> = ({setVisibleMobileNav,visible}) => {
    const rootStore = useContext(RootStoreContext);
    const { activeMenu,setActiveMenu } = rootStore.commonStore;
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const history = useHistory();
    return (
      <>
      {
      <Menu 
      pointing
      secondary
      size='massive'
      className='mainMenu'
       >
       <Container>
       <Menu.Item as='a' header  
        onClick={() => {
          setActiveMenu(-1);
          setVisibleMobileNav(false);
            history.push(`/`);
          }}
          style={{ padding:"0.5em 1.14285714em"}}
          >
                <div style={{display:"flex", alignItems:"center"}}>
                  <img
                      src="/assets/afitapp.png"
                      alt="afitapp"
                      style={{ height:"50px"}}
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