import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Image, Modal, Segment } from 'semantic-ui-react'
import { LoginForm } from '../../features/user/LoginForm';
import { RegisterForm } from '../../features/user/RegisterForm';
import { RootStoreContext } from '../stores/rootStore';

export const LoginRequiredPage = () => {

    const rootStore = useContext(RootStoreContext);
    const {openModal,closeModal,modal} = rootStore.modalStore;

   const handleLoginClick = (e:any) => {
    e.stopPropagation();
    if(modal.open) closeModal();
    openModal("Giriş Yap", <>
        <Image size='large' src='/assets/placeholder.png' wrapped />
        <Modal.Description>
        <LoginForm location={"/"} />
        </Modal.Description>
        </>,true,
        <p>Üye olmak için <span className="registerLoginAnchor" onClick={openRegisterModal}>tıklayınız</span></p>) 
    }

    const openRegisterModal = (e:any) => {
        e.stopPropagation();
        if(modal.open) closeModal();
        openModal("Üye Kaydı", <>
        <Image size='large' src='/assets/placeholder.png' wrapped />
        <Modal.Description>
        <RegisterForm location={"/"} />
        </Modal.Description>
        </>,true,
        <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>) 
    }

    
    return (
        <Segment placeholder>
        <Header icon>
            <Icon name='search' />
            Bu ve daha bir çok uzman/aktivite keşfetmek için giriş yapmanız gerekmektedir.
        </Header>
        <Segment.Inline>
            <Button as={Link} to='/' primary>
                Ana Sayfa
            </Button>
            <Button onClick={handleLoginClick} color="green">
                Giriş
            </Button>
        </Segment.Inline>
    </Segment>
    )
}
