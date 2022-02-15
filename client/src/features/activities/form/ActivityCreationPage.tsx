import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon, Grid, Modal, Step, Label, Container } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import {  IPaymentCardInfo } from '../../../app/models/activity';
import { useMediaQuery } from 'react-responsive'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';


 const ActivityCreationPage: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {setsubMerchantFormValues} = rootStore.userStore;
  const {
    cities
  } = rootStore.commonStore;

  const [loading, setLoading] = useState(false);
  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [stepNo, setStepNo] = useState(0);  

    const[step1Completed, setStep1Completed] = useState(false);
    const[step0Completed, setStep0Completed] = useState(false);
    const[showInfo, setShowInfo] = useState(false);
    const[showPaymentPage, setShowPaymentPage] = useState(false);
    const[showUserPaymentInfoPage, setShowUserPaymentInfoPage] = useState(true);
    const[phoneError, setphoneError] = useState(false);

    



if(loading) return <LoadingComponent content='Loading...'/>  

  




  const handleFinalFormSubmit = (values: IPaymentCardInfo) => {

    //setLoading(true);
    
  }

 

//   const handleCityChanged = (e: any, data: string) => {  
//     if((activityUserPaymentInfo.cityId !== data))
//     setActivityUserPaymentInfo({...activityUserPaymentInfo,cityId: data});
    
//  }
    return (
    <Fragment> 
     <Grid stackable style={{marginBottom:"50px"}}>
     
      <Grid.Row>
      <Grid.Column width={!isTablet ? 12 : 11}>
        <Segment clearing>
         
        </Segment>
      </Grid.Column>
      <Grid.Column width={!isTablet ? 4 : 5}>
    <Segment>
    <Container>
      {
       
      }
      
       </Container>
    </Segment>
    </Grid.Column>
       </Grid.Row>
      
    </Grid>
   </Fragment>
    )
}

export default observer(ActivityCreationPage);