import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Button, Container, Header, Icon, Image, List, Modal } from 'semantic-ui-react';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { useMediaQuery } from 'react-responsive'

import { RootStoreContext } from '../../app/stores/rootStore';
import FormPage1 from './FormPage1';
import { history } from '../..';

const TrainerForm = () =>{
    const rootStore = useContext(RootStoreContext);
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const {trainerForm, setTrainerForm} = rootStore.userStore;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    useEffect(() => {
      setTrainerForm(new TrainerFormValues());
   }, [])

 const handleApplyButtonClick = (e:any) =>{

  e.stopPropagation();
  if(modal.open) closeModal();

    history.push('/trainerOnboarding');
     
 }


    return (
      <> 
      <div className='trainerwelcome'>
      <Header as="h3">
        Başvuru Şartları
      </Header>  
       
        <List bulleted className="applicationConditions">
        <List.Item key="applicationConditions_1">18 yaşından büyük olmak</List.Item>
        <List.Item key="applicationConditions_2">Başvurmak istediğin alan/alanlarda bir uzmanlık belgesine sahip olmak(diploma, sertifika vs.)</List.Item>
        {/* <List.Item key="applicationConditions_3">Oluşturacağınız aktivite ücretlerini size aktarabilmemiz için bir banka hesabınız olması</List.Item> */}
        </List>
      
        <p className="applicationConditions">
        Hazırsan haydi başvur <Icon style={{marginLeft:"5px"}} name="thumbs up outline"></Icon>
        </p> 
        <Button className='orangeBtn' fluid circular content="Başvur" onClick={handleApplyButtonClick} />

      </div>
        
     </>
    );
}


export default observer(TrainerForm)