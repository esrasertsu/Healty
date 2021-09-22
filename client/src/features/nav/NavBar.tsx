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

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout,isLoggedIn} = rootStore.userStore;
    const { activeMenu,setActiveMenu } = rootStore.commonStore;
    const { notificationCount } = rootStore.userStore;

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
                <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>,"", false
                ) 
               
            }
    

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
            history.push(`/`);
          }}
          style={{ padding:"0.5em 1.14285714em"}}
          >
                <div style={{display:"flex", alignItems:"center"}}>
                  <img
                      src="/assets/logo.png"
                      alt="logo"
                      style={{ height:"50px"}}
                    />
                </div>
                  
                  </Menu.Item>
                  <Menu.Item>
                    <NavSearchArea />
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
            <Menu.Item>
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
                    <Label style={{margin:"0 0 0 10px"}} color='green'>
                    {notificationCount}
                    </Label>
                  </Dropdown.Item>
                  <Dropdown.Item text="Logout" onClick={logout} icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}

          {
            !isLoggedIn && 
            <>
            <Menu.Item>
              <Button.Group>
              <Button icon="hand point up" content="Uzman Başvurusu" labelPosition="right" key={"trainer-nav"} color="orange" style={{borderRadius: ".28571429rem", marginRight:"10px"}}
          
          onClick={(e:any)=>
            {
              handleTrainerFormClick(e);
            }
            
            }>
            </Button>
              <Button key={"login-nav"} color="blue" content={"Giriş Yap"} style={{color:"#fff",borderRadius: ".28571429rem"}}
               
               onClick={(e:any)=>
                 {
                   handleLoginClick(e);
                 }
                 
                 }></Button>
                  <Button key={"reg-nav"} basic color="blue" content={"Kaydol"} style={{borderRadius: ".28571429rem"}}
          
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