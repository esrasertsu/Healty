import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Image, Modal, Segment } from 'semantic-ui-react'
import { history } from '../..';
import { LoginForm } from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';

export const LoginRequiredPage = () => {

    const rootStore = useContext(RootStoreContext);
    const {openModal} = rootStore.modalStore;

   const handleLoginClick = (e:any) => {
    e.stopPropagation();
        openModal("Giriş Yap", <>
        <Image size='large' src='/assets/placeholder.png' wrapped />
        <Modal.Description>
        <LoginForm location={"/"} />
        </Modal.Description>
        </>,true) 
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
