import React, { useContext } from 'react';
import { Menu, Container, Image, Dropdown, Label, Icon, Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import NavSearchArea from './NavSearchArea';
import LoginForm from '../user/LoginForm';
import  RegisterForm from '../user/RegisterForm';
import TrainerForm from '../user/TrainerRegisterModal';
import { useMediaQuery } from 'react-responsive'
import { history } from '../..';

interface IProps{
  fixed:boolean;
}

const NavBar: React.FC<IProps> = ({fixed}) => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout,isLoggedIn,loggingOut} = rootStore.userStore;
    const { activeMenu,setActiveMenu } = rootStore.commonStore;
    const { notificationCount } = rootStore.userStore;

    const {openModal,closeModal,modal} = rootStore.modalStore;


    const smallDesktop  = useMediaQuery({ query: '(max-width: 1300px)' })
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const handleLoginClick = (e:any) => {
        e.stopPropagation();
        if(modal.open) closeModal();
  
        openModal("Giriş Yap", <>
        <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'} src='/assets/Login1.jpg'  wrapped />
        <Modal.Description className="loginreg">
        <LoginForm location={"/"} />
        </Modal.Description>
        </>,true,
        "","blurring",true, "loginModal") 
        
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
              <>
              <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>
              </>,"blurring",true) 
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
                <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>,"blurring",true
                ) 
               
            }
    

    
    return (
      <>
      {
      <Menu 
      // fixed={fixed ? 'top' : undefined}
      pointing
      secondary
      size='massive'
      className='mainMenu'
       >
       <Container className='desktopNavBar'>
       <Menu.Item as='a' header  
        onClick={() => {
          setActiveMenu(-1);
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
                 <Menu.Item>
                    <NavSearchArea />
                  </Menu.Item>
                  <Menu.Item position="right" as={Link} to="/profiles" className='desktopMenu'
                  active={activeMenu === 0}
                onClick={() => {
                   //setLoadingProfiles(true);
                   setActiveMenu(0);
                  //  history.push(`/profiles`);
                    }} > <Icon name="graduation cap"></Icon> <span>Uzmanlar</span></Menu.Item> 
               <Menu.Item as={Link} to="/activities" className='desktopMenu'
                active={activeMenu === 1}
                  onClick={() => {
                 //   setLoadingInitial(true);
                    setActiveMenu(1)
                   // history.push(`/activities`);
                    }} ><Icon name="heartbeat"></Icon> <span>Aktiviteler</span></Menu.Item>

                
          <Menu.Item as={Link} to="/blog" className='desktopMenu'
           active={activeMenu === 2}
             onClick={() => {
                 //  setLoadingPosts(true);
                   // history.push(`/blog`);
                    setActiveMenu(2)
                    }} ><Icon name="newspaper outline"></Icon> <span>Blog</span></Menu.Item>

          {user && (
            <Menu.Item>
              <Image avatar spaced="right" src={user.image || "/assets/user.png"}
               onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}} />
              <Dropdown pointing={smallDesktop ? "top right": "top left"} text={user.displayName}>
                <Dropdown.Menu className='mobileMenu' style={{padding:"10px"}}>
                  <Dropdown.Item
                    key="profil"
                    as={Link}
                    to={`/profile/${user.userName}`}
                    text="Profilim"
                    icon="user outline"
                    className='border'
                    onClick={()=>{setActiveMenu(-1);}}
                  ></Dropdown.Item>
                  <Dropdown.Item
                    key="mesaj"
                    as={Link}
                    to={`/messages`}
                    className='border'

                    onClick={()=>{setActiveMenu(-1);}}
                  >  <Icon name="mail outline" />
                       Mesajlar
                    <Label style={{margin:"0 0 0 10px"}} color='green'>
                    {notificationCount}
                    </Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="order"
                    as={Link}
                    to={`/orders`}
                    className='border'
                    onClick={()=>{setActiveMenu(-1);}}
                  >  <Icon name='unordered list' />
                       Rezervasyonlarım
                  </Dropdown.Item>
                { user && user.role !== "User" && <Dropdown.Item
                    key="myActivities"
                    as={Link}
                    to={`/myActivities`}
                    className='border'
                    onClick={()=>{setActiveMenu(-1);}}
                  >  <Icon name='calendar check outline' />
                       Aktivitelerim
                  </Dropdown.Item>}
                  <Dropdown.Item
                    key="saved"
                    as={Link}
                    to={`/saved`}
                    className='border'
                    onClick={()=>{setActiveMenu(-1);}}
                  >  <Icon name="bookmark outline" />
                       Favorilerim
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="settings"
                    as={Link}
                    to={`/settings`}
                    onClick={()=>{setActiveMenu(-1);}}
                  >  <Icon name='settings' />
                       Ayarlar
                  </Dropdown.Item>
                  <Dropdown.Item>
                  <Button
                  circular
                  size="mini"
                  loading={loggingOut}
                  onClick={logout} 
                  basic
                  color="orange"
                  
                  className="logoutWebButton" >Çıkış
                  </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}

          {
            !isLoggedIn && 
            <>
            <Menu.Item>
              <Button.Group>
              <Button circular content="Uzman Başvurusu" key={"trainer-nav"} className='orangeBtn' style={{  borderRadius: "5rem", marginRight:"10px"}}
          
          onClick={(e:any)=>
            {
              handleTrainerFormClick(e);
            }
            
            }>
            </Button>
              <Button key={"login-nav"} className='blueBtn'  content={"Giriş Yap"} style={{color:"#fff",borderRadius: "5rem", marginRight:"5px"}}
               
               onClick={handleLoginClick}></Button>
                  <Button key={"reg-nav"} basic color="blue" content={"Kaydol"} style={{borderRadius: "5rem"}}
          
          onClick={(e:any)=>
            {
              handleRegisterClick(e);
            }
            
            }></Button>
            
              </Button.Group>
                  
            </Menu.Item>
            
       </>
          }
         </Container>         
       
      </Menu>
}
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