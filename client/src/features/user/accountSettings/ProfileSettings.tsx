import React, { Fragment, useContext, useState } from 'react'
import { Segment, Header, Form, Button, Grid, Container, Message, Icon } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { RootStoreContext } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { OnChange } from 'react-final-form-listeners';
import { IAccountInfoValues } from '../../../app/models/user';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';


 const ProfileSettings: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
  loadingUserInfo,editAccountDetails,accountForm,setAccountForm, accountInfo, submittingAccountInfo
  } = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [errorMessage, setErrorMessage]= useState("")  
    const [trainerFormMessage, setTrainerFormMessage]= useState(false)  

  const handleFinalFormSubmit = (values: IAccountInfoValues) => {

    editAccountDetails(values)
    
  }

 

 if(submittingAccountInfo) return <LoadingComponent content='Güncelleniyor...'/>  

    return (
    <Fragment> 
        <Header>
    <Icon name='id badge outline' />
    <Header.Content>
       Hesap Bilgileri
      <Header.Subheader>**Sisteme kayıtlı temel kullanıcı bilgileri</Header.Subheader>
    </Header.Content>
  </Header>
     <Grid stackable style={{marginBottom:"50px"}}>
     
      <Grid.Row>
      <Grid.Column width={!isTablet ? 12 : 11}>
        <Segment clearing>
        { trainerFormMessage && <Message
      error
      header=''
      content={errorMessage}
    />}
        <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={values => {
        const errors:any = {};

        if (!values.displayName) {
          errors.displayName = 'Profil adı zorunlu alan'
        }
        if (!values.userName) {
            errors.userName = 'Kullanıcı adı zorunlu alan'
          }
        if (!values.email) {
            errors.email = 'Email zorunlu alan'
          }
  
          if(!values.email || !/.+@.+\.[A-Za-z]+$/.test(values.email))
          {
            errors.email = 'Geçersiz email adresi'
          }

        return errors
      }}
      initialValues={accountForm!}
      render={({ handleSubmit, submitting, submitError,
        invalid,
        dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
            <Field 
            width={!isTablet ? 6 : 16}
            name="email" 
            placeholder="Email" 
            label="Email*" 
            maxLength={40}
            labelName="emailLabel" 
            component={TextInput} 
            value={accountForm.email}
            />
            <OnChange name="email">
                {(value, previous) => {
                    if(value !== accountForm.email)
                    {
                        setAccountForm({...accountForm,email: value});
                    }
                }}
            </OnChange>
            <Field
              width={!isTablet ? 6 : 16}
              label="Kullanıcı Adı*"
              labelName="userNameLabel"
            name='userName'
            component={TextInput}
            maxLength={30}
            placeholder='Kullanıcı adı'
            value={accountForm!.userName}
          />
           <OnChange name="userName">
                {(value, previous) => {
                    setAccountForm({...accountForm,userName: value});
                }}
            </OnChange>
 
            <Field
            label="Profil Adı*"
            labelName="displayNameLabel"
            name='displayName'
            maxLength={40}
            component={TextInput}
            placeholder='Profil ismi'
            value={accountForm!.displayName}
          />
           <OnChange name="displayName">
                {(value, previous) => {
                    setAccountForm({...accountForm,displayName: value});
                }}
            </OnChange>
         
         
          <Button 
             loading={submitting || submittingAccountInfo}
             disabled={submitting || invalid ||submittingAccountInfo}
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
     accountInfo &&  (
         <>
     <div className=''><h4 style={{color:"orange"}}>Hesap Türü:</h4>{accountInfo.role}</div>
     <br />
{     accountInfo.applicationDate && <div className=''><h4>Başvuru tarihi:</h4>{format(new Date(accountInfo.applicationDate), 'dd MMMM yyyy - HH:mm',{locale: tr})}</div>
}
<div className=''><h4>Üyelik tarihi:</h4>{format(new Date(accountInfo.registrationDate), 'dd MMMM yyyy - HH:mm',{locale: tr})}</div>
<div className=''><h4>Profil son güncelleme:</h4>{format(new Date(accountInfo.lastProfileUpdatedDate), 'dd MMMM yyyy - HH:mm',{locale: tr})}</div>

 </>
     )}
     
      
       </Container>
    </Segment>
    </Grid.Column>
       </Grid.Row>
      
    </Grid>
   </Fragment>
    )
}

export default observer(ProfileSettings);