import React, { useContext } from 'react';
import { Menu, Container, Image, Dropdown, Label, Icon, Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import NavSearchArea from './NavSearchArea';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import TrainerForm from '../user/TrainerForm';
import { useMediaQuery } from 'react-responsive'

interface IProps{
    setVisibleMobileNav:(visible:boolean) => void;
    visible:boolean;
}
const MobileNavMenu: React.FC<IProps> = ({setVisibleMobileNav,visible}) =>{
    const rootStore = useContext(RootStoreContext);
    const { user, logout} = rootStore.userStore;
    const { activeMenu,setActiveMenu, token } = rootStore.commonStore;
    const { notificationCount, isLoggedIn } = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;


    
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const handleLoginClick = (e:any) => {
        e.stopPropagation();
        if(modal.open) closeModal();
  
            openModal("Giriş Yap", <>
            <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.png' wrapped />
            <Modal.Description className="loginreg">
            <LoginForm location={"/"} />
            </Modal.Description>
            </>,true,
             <p>Üye olmak için <span className="registerLoginAnchor" onClick={handleRegisterClick}>tıklayınız</span></p>) 
        }
  
        const handleRegisterClick = (e:any) => {
      
          e.stopPropagation();
          if(modal.open) closeModal();
  
              openModal("Üye Kaydı", <>
              <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.png' wrapped />
              <Modal.Description className="loginreg">
              <RegisterForm location={"/"} />
              </Modal.Description>
              </>,true,
              <>
              <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>
              <p>Uzman başvuru için <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>tıkla!</span></p>
              </>) 
          }
  
          const handleTrainerFormClick= (e:any) => {
      
            e.stopPropagation();
            if(modal.open) closeModal();
  
                openModal("Uzman Başvuru Formu", <>
                <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/welcome1.png' wrapped />
                <Modal.Description>
                <TrainerForm />
                </Modal.Description>
                </>,true,
                <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>) 
               
            }


    return (
      <>
      {
       <Container className="mobileNavMenu_container">
           
           {!isLoggedIn && (
       <Menu.Item header>
               <p style={{ fontSize: '1em', color: "#1a2b49", fontWeight:500, textAlign:"left" }}>Eğitmenlere erişmek ve aktivitelere katılabilmek için:</p>
                <Button
                  onClick={handleRegisterClick}
                 className="loginRegMobileButton" primary>Giriş Yap/Hesap Oluştur</Button>
                  
                  </Menu.Item>
           )}
                  <Menu.Item as={Link} to="/profiles" 
                  active={activeMenu === 0}
                  className="mobileNavMenu_container_item"
                onClick={() => {
                   //setLoadingProfiles(true);
                   setActiveMenu(0);
                   setVisibleMobileNav(false);
                    }} >Eğitmenler</Menu.Item> 
               <Menu.Item as={Link} to="/activities" name="Aktiviteler"
                active={activeMenu === 1}
                className="mobileNavMenu_container_item"

                  onClick={() => {
                 //   setLoadingInitial(true);
                    setActiveMenu(1)
                    setVisibleMobileNav(false);
                }} />

                
          <Menu.Item as={Link} to="/blog" name="Blog Yazılar" 
           active={activeMenu === 2}
           className="mobileNavMenu_container_item"

             onClick={() => {
                 //  setLoadingPosts(true);
                   // history.push(`/blog`);
                    setActiveMenu(2)
                    setVisibleMobileNav(false);
                    }} />

          {user && (
            <Menu.Item  className="mobileNavMenu_container_item" >
              <Image avatar spaced="right" src={user.image || "/assets/user.png"} />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    key="profil"
                    as={Link}
                    to={`/profile/${user.userName}`}
                    text="Profil"
                    icon="user"
                  ></Dropdown.Item>
                  <Dropdown.Item
                    key="mesaj"
                    as={Link}
                    to={`/messages`}
                  >  <Icon name='mail' />
                       Mesajlar
                    <Label style={{margin:"0 0 0 10px"}} color='teal'>
                    {notificationCount}
                    </Label>
                  </Dropdown.Item>
                  <Dropdown.Item text="Logout" onClick={logout} icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
         </Container>         
       
}

</>
    );
}

export default observer(MobileNavMenu);