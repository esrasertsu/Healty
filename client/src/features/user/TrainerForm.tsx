import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Container, Header, Icon, Image, List, Modal } from 'semantic-ui-react';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { useMediaQuery } from 'react-responsive'

import { RootStoreContext } from '../../app/stores/rootStore';
import FormPage1 from './FormPage1';

const TrainerForm:React.FC = () =>{
    const rootStore = useContext(RootStoreContext);
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const {trainerForm, setTrainerForm} = rootStore.userStore;

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    useEffect(() => {
      setTrainerForm(new TrainerFormValues());
   }, [])

 const handleApplyButtonClick = (e:any) =>{

  e.stopPropagation();
  if(modal.open) closeModal();

      openModal("Uzman Başvuru Formu", <>
      <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'} src='/assets/welcome.png' wrapped />
      <Modal.Description>
      <FormPage1 />
      </Modal.Description>
      </>,true,
     "") 
     
 }


    return (
      <> 
      <div>
      <Header as="h3">
        Başvuru Şartları
      </Header>  
        <p>
        <List bulleted className="applicationConditions">
        <List.Item>18 yaşından büyük olmak</List.Item>
        <List.Item>Başvurmak istediğiniz alan/alanlarda bir uzmanlık belgeniz olması(diploma, sertifika vs.)</List.Item>
        <List.Item>Oluşturacağınız aktivite ücretlerini size aktarabilmemiz için bir banka hesabınız olması</List.Item>
        </List>
        </p>
        <p className="applicationConditions">
        Dokümanların hazırsa haydi seni bekliyoruz <Icon style={{marginLeft:"5px"}} name="thumbs up outline"></Icon>
        </p> 
        <Header as="h3" className="applyButton" onClick={handleApplyButtonClick}>
        Başvur &gt;&gt;
      </Header>  
      </div>
        
     </>
    );
}


export default observer(TrainerForm)