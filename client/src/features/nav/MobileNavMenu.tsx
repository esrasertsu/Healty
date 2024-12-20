import React, { useContext } from 'react';
import { Menu, Container, Image, Label, Icon, Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import  RegisterForm from '../user/RegisterForm';
import TrainerForm from '../user/TrainerRegisterModal';
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next';

interface IProps{
    setVisibleMobileNav:(visible:boolean) => void;
    visible:boolean;
}
const MobileNavMenu: React.FC<IProps> = ({setVisibleMobileNav,visible}) =>{
    const rootStore = useStore();
    const { user, logout,loggingOut} = rootStore.userStore;
    const { activeMenu,setActiveMenu, token } = rootStore.commonStore;
    const { notificationCount, isLoggedIn } = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const { i18n, t } = useTranslation();


    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const handleLoginClick = (e:any) => {
      e.stopPropagation();
      if(modal.open) closeModal();

          openModal("Giriş Yap", <>
          <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
          <Modal.Description className="loginreg">
          <LoginForm location={"/"} />
          </Modal.Description>
          </>,true,
          "","blurring",true) 
      }
        const handleRegisterClick = (e:any) => {
      
          e.stopPropagation();
          if(modal.open) closeModal();
  
              openModal("Üye Kaydı", <>
              <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
              <Modal.Description className="loginreg">
              <RegisterForm location={"/"} />
              </Modal.Description>
              </>,true,
              <div className="modalformFooter">
              <p>Already a member? <span className="registerLoginAnchor" onClick={handleLoginClick}>Login</span></p>
              <p>Trainer application form <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>here!</span></p>
              </div>) 
          }
  
          const handleTrainerFormClick= (e:any) => {
      
            e.stopPropagation();
            if(modal.open) closeModal();
  
                openModal("Uzman Başvuru Formu", <>
                <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/contactus.jpg' wrapped />
                <Modal.Description>
                <TrainerForm />
                </Modal.Description>
                </>,true,
                <p>Already a member? <span className="registerLoginAnchor" onClick={handleLoginClick}>Login</span></p>) 
               
            }


    return (
      <>
      {
       <Container className="mobileNavMenu_container">
           
           {!isLoggedIn && (
               <>
       <Menu.Item header className="mobileNavMenu_Header">
               <h2 style={{fontWeight:500}}>Welcome</h2>
               <p style={{ fontSize: '16px', fontWeight:500 }}>Uzmanlarla iletişime geçebilmek, aktivitelere katılabilmek ve çok daha fazlası için:</p>
                <Button
                circular
                   onClick={(e:any) => 
                    { 
                    handleRegisterClick(e);
                     setActiveMenu(-1)
                     setVisibleMobileNav(false);
                 }}
                 className="blueBtn">{t("signup")}</Button>
                   <Button
                circular
                style={{marginTop:"20px"}}
                onClick={(e:any) => 
                    { 
                    handleTrainerFormClick(e);
                     setActiveMenu(-1)
                     setVisibleMobileNav(false);
                 }}
                 className="loginRegMobileButton orangeBtn">{t("trainerApplication")}</Button>
                  
                  </Menu.Item>
           
            <Menu.Item
                  active={activeMenu === 0}
                  className="mobileNavMenu_container_item"
                onClick={(e:any) => {
                   handleLoginClick(e);
                   setActiveMenu(0);
                   setVisibleMobileNav(false);
                    }} >
                        <h3 className="mobileNavMenu_container_item login" style={{color:"blue"}}>
                        <Icon name="user" style={{marginRight:"10px"}} ></Icon>
                        {t("login")}
                        </h3>
                        </Menu.Item> 
                        </>
                        )}
                        
                  <Menu.Item as={Link} to="/profiles" 
                  active={activeMenu === 1}
                  className="mobileNavMenu_container_item"
                onClick={() => {
                   //setLoadingProfiles(true);
                   setActiveMenu(1);
                   setVisibleMobileNav(false);
                    }} >
                        <h3 className="mobileNavMenu_container_item">
                        <Icon name="graduation cap" style={{marginRight:"10px"}} ></Icon>
                          Trainers
                        </h3>
                        </Menu.Item> 
               <Menu.Item as={Link} to="/activities" 
                active={activeMenu === 2}
                className="mobileNavMenu_container_item"

                  onClick={() => {
                 //   setLoadingInitial(true);
                    setActiveMenu(2)
                    setVisibleMobileNav(false);
                }}>
                      <h3 className="mobileNavMenu_container_item">
                        <Icon name="calendar alternate outline" style={{marginRight:"10px"}} ></Icon>
                        Activities
                        </h3>
                </Menu.Item>

                
          <Menu.Item as={Link} to="/blog" 
           active={activeMenu === 3}
           className="mobileNavMenu_container_item"

             onClick={() => {
                 //  setLoadingPosts(true);
                   // history.push(`/blog`);
                    setActiveMenu(3)
                    setVisibleMobileNav(false);
                    }} >
                        
                      <h3 className="mobileNavMenu_container_item">
                      <Icon name="pencil alternate" style={{marginRight:"10px"}} ></Icon>
                        Blogs
                        </h3>
                    </Menu.Item>

          {isLoggedIn && (
                       <>
              <Menu.Item style={{paddingTop:"40px"}}>
               <p style={{ fontSize: '1em', color: "#1a2b49", fontWeight:500, textAlign:"left" }}>Hesabım:</p>
             </Menu.Item>
              <Menu.Item as={Link} to={`/profile/${user!.userName}`}
                    active={activeMenu === 4}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(4)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="user outline" style={{marginRight:"10px"}} ></Icon>
                                    Profilim
                                    </h3>
                    </Menu.Item>
                    <Menu.Item as={Link} to={`/saved`}
                    active={activeMenu === 5}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(5)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="bookmark outline" style={{marginRight:"10px"}} ></Icon>
                                    Favorilerim
                                    </h3>
                    </Menu.Item>
                    <Menu.Item as={Link} to={`/orders`}
                    active={activeMenu === 6}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(6)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="unordered list" style={{marginRight:"10px"}} ></Icon>
                                    Rezervasyonlarım
                                    </h3>
                    </Menu.Item>
                    { user && user.role !== "User" &&  <Menu.Item as={Link} to={`/myActivities`}
                    active={activeMenu === 9}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(9)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="calendar check outline" style={{marginRight:"10px"}} ></Icon>
                                    Aktivitelerim
                                    </h3>
                    </Menu.Item>}
                    <Menu.Item as={Link} to={`/messages`}
                    active={activeMenu === 7}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(7)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="mail outline" style={{marginRight:"10px"}} ></Icon>
                                    Mesajlar
                                    <Label style={{margin:"0 0 0 10px"}} className="messageNotificationCount">
                                    {notificationCount}
                                    </Label>
                                    </h3>
                    </Menu.Item>
                    <Menu.Item as={Link} to={`/settings`}
                    active={activeMenu === 8}
                    className="mobileNavMenu_container_item"

                        onClick={() => {
                            //  setLoadingPosts(true);
                            // history.push(`/blog`);
                                setActiveMenu(8)
                                setVisibleMobileNav(false);
                                }} >
                                    
                                <h3 className="mobileNavMenu_container_item">
                                <Icon name="settings" style={{marginRight:"10px"}} ></Icon>
                                   Hesap Ayarları
                                    </h3>
                    </Menu.Item>
                    <Menu.Item>
                <Button
                circular
                basic
                loading={loggingOut}
                  onClick={() => 
                   { logout();
                    setActiveMenu(-1)
                    setVisibleMobileNav(false);
                }
                } 
                 className="logoutMobileButton" >Çıkış yap</Button>
                  
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