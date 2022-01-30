import { observer } from 'mobx-react';
import React, { useContext } from 'react'
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom'
import { Button, Container, Header, Icon, Image, Modal, Segment } from 'semantic-ui-react'
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';

 const LoginRequiredPage = () => {

    const rootStore = useContext(RootStoreContext);
    const {openModal,closeModal,modal} = rootStore.modalStore;

    
    
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
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

 

    
    return (
        <Container className="pageContainer">

        <Segment placeholder>
        <Header icon>
            <Icon name='search' />
            Bu ve daha bir çok uzman/aktivite keşfetmek için giriş yapmanız gerekmektedir.
        </Header>
        <Segment.Inline>
            <Button as={Link} to='/' primary circular>
                Ana Sayfa
            </Button>
            <Button onClick={handleLoginClick} color="green" circular>
                Giriş
            </Button>
        </Segment.Inline>
    </Segment>
    </Container>
    )
}


export default observer(LoginRequiredPage);