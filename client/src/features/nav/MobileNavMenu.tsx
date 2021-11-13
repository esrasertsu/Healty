import React, { useContext } from 'react';
import { Menu, Container, Image, Label, Icon, Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import TrainerForm from '../user/TrainerRegisterModal';
import { useMediaQuery } from 'react-responsive'

interface IProps{
    setVisibleMobileNav:(visible:boolean) => void;
    visible:boolean;
}
const MobileNavMenu: React.FC<IProps> = ({setVisibleMobileNav,visible}) =>{
    const rootStore = useContext(RootStoreContext);
    const { user, logout,loggingOut} = rootStore.userStore;
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
             <p className="modalformFooter">Üye olmak için <span className="registerLoginAnchor" onClick={handleRegisterClick}>tıklayınız</span></p>) 
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
              <div className="modalformFooter">
              <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>
              <p>Uzman başvuru için <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>tıkla!</span></p>
              </div>) 
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
                   onClick={(e:any) => 
                    { 
                    handleRegisterClick(e);
                     setActiveMenu(-1)
                     setVisibleMobileNav(false);
                 }}
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
                    }} >
                        <h3 className="mobileNavMenu_container_item">
                        <Icon size="large" name="users" style={{marginRight:"10px"}} ></Icon>
                          Eğitmenler
                        </h3>
                        </Menu.Item> 
               <Menu.Item as={Link} to="/activities" 
                active={activeMenu === 1}
                className="mobileNavMenu_container_item"

                  onClick={() => {
                 //   setLoadingInitial(true);
                    setActiveMenu(1)
                    setVisibleMobileNav(false);
                }}>
                      <h3 className="mobileNavMenu_container_item">
                        <Icon size="large" name="calendar alternate outline" style={{marginRight:"10px"}} ></Icon>
                        Aktiviteler
                        </h3>
                </Menu.Item>

                
          <Menu.Item as={Link} to="/blog" 
           active={activeMenu === 2}
           className="mobileNavMenu_container_item"

             onClick={() => {
                 //  setLoadingPosts(true);
                   // history.push(`/blog`);
                    setActiveMenu(2)
                    setVisibleMobileNav(false);
                    }} >
                        
                      <h3 className="mobileNavMenu_container_item">
                      <Icon size="large" name="pencil alternate" style={{marginRight:"10px"}} ></Icon>
                        Blog Yazılar
                        </h3>
                    </Menu.Item>

          {isLoggedIn && (
                       <>
              <Menu.Item style={{paddingTop:"40px"}}>
               <p style={{ fontSize: '1em', color: "#1a2b49", fontWeight:500, textAlign:"left" }}>Hesabım:</p>
             </Menu.Item>
              <Menu.Item as={Link} to={`/profile/${user!.userName}`}
                    active={activeMenu === 3}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(3)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon size="large" name="user" style={{marginRight:"10px"}} ></Icon>
                                    Profilim
                                    </h3>
                    </Menu.Item>
                    <Menu.Item as={Link} to={`/messages`}
                    active={activeMenu === 4}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(4)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon size="large" name="mail" style={{marginRight:"10px"}} ></Icon>
                                    Mesajlar
                                    <Label style={{margin:"0 0 0 10px"}} className="messageNotificationCount">
                                    {notificationCount}
                                    </Label>
                                    </h3>
                    </Menu.Item>
                    <Menu.Item as={Link} to={`/settings`}
                    active={activeMenu === 5}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(5)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon size="large" name="settings" style={{marginRight:"10px"}} ></Icon>
                                    Ayarlar
                                    </h3>
                    </Menu.Item>
                    <Menu.Item>
                <Button
                loading={loggingOut}
                  onClick={() => 
                   { logout();
                    setActiveMenu(-1)
                    setVisibleMobileNav(false);
                }
                } 
                 className="logoutMobileButton" primary>Çıkış yap</Button>
                  
                  </Menu.Item>

                  </>
           )
           }

         
         </Container>         
       
}

</>
    );
}

export default observer(MobileNavMenu);