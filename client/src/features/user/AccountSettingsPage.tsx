import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon, Grid, Modal, Step, Label, Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import DropdownInput from '../../app/common/form/DropdownInput';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../app/common/form/TextInput';
import { OnChange } from 'react-final-form-listeners';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import PhoneNumberInput from '../../app/common/form/PhoneNumberInput';
import { IAccountInfoValues } from '../../app/models/user';


 const AccountSettingsPage: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
    cities
  } = rootStore.commonStore;
  const {
    getAccountDetails, user, loadingUserInfo,editAccountDetails,accountForm,setAccountForm
  } = rootStore.userStore;

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

    





useEffect(() => {
    getAccountDetails();
}, [getAccountDetails])


  const handleFinalFormSubmit = (values: IAccountInfoValues) => {

    editAccountDetails(values)
    
  }

 

  const handleCityChanged = (e: any, data: string) => {  
    setAccountForm({...accountForm,cityId: data});
    
 }

 if(loading || loadingUserInfo) return <LoadingComponent content='Loading...'/>  

    return (
    <Fragment> 
     <Grid stackable style={{marginBottom:"50px"}}>
     
      <Grid.Row>
      <Grid.Column width={!isTablet ? 12 : 11}>
        <Segment clearing>
        <FinalForm
      onSubmit={handleFinalFormSubmit}
      initialValues={accountForm!}
      render={({ handleSubmit, invalid, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <label id="nameLabel">Profil ismi*</label>
          <Field
            labelName="nameLabel"
            name='displayName'
            component={TextInput}
            placeholder='Profil ismi'
            value={accountForm!.displayName}
          />
           <OnChange name="displayName">
                {(value, previous) => {
                    setAccountForm({...accountForm,displayName: value});
                }}
            </OnChange>
            <label id="nameLabel">Ad*</label>
          <Field
            labelName="nameLabel"
            name='name'
            component={TextInput}
            placeholder='İsim'
            value={accountForm!.name}
          />
           <OnChange name="name">
                {(value, previous) => {
                    
                    setAccountForm({...accountForm,name: value});
                }}
            </OnChange>
            <label id="surnameLabel">Soyad*</label>
          <Field
            labelName="surnameLabel"
            name='surname'
            component={TextInput}
            placeholder='Soyad'
            value={accountForm!.surname}
          />
           <OnChange name="surname">
                {(value, previous) => {
                    
                    setAccountForm({...accountForm,surname: value});
                }}
            </OnChange>
          <label>Sistem Kullanıcı Adı</label>
          <Field
            name='userName'
            component={TextInput}
            rows={3}
            placeholder='Kullanıcı adı'
            value={accountForm!.userName}
          />
           <OnChange name="userName">
                {(value, previous) => {
                    setAccountForm({...accountForm,userName: value});
                }}
            </OnChange>
          <label>Adres</label>
          <Field
            name='address'
            component={TextAreaInput}
            rows={2}
            placeholder='Adres'
            value={accountForm!.address}
          />
           <OnChange name="address">
                {(value, previous) => {
                    setAccountForm({...accountForm,address: value});
                }}
            </OnChange>
           <label>Telefon Numarası</label>
           <Field
                  width={isMobile ? "16" :"4"}
                  name="phoneNumber"
                  labelName="gsmNumber_label"
                  placeholder="Telefon Numarası"
                  component={PhoneNumberInput}
                  value={accountForm.phoneNumber}
                /> 
                <OnChange name="phoneNumber">
                {(value, previous) => {
                    setAccountForm({...accountForm,phoneNumber: value});
                      
                }}
                </OnChange>

                <label id="citylabel">Şehir*</label>
                <Field 
                  name="cityId"
                  placeholder="City"
                  component={DropdownInput}
                  options={cities}
                  value={accountForm!.cityId}
                  labelName="citylabel"
                  emptyError={accountForm.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                />
               
        
          <Button 
            loading={submitting}
            floated='right'
            positive
            circular
            content='Güncelle'
          />
        </Form>
      )}
    />
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

export default observer(AccountSettingsPage);