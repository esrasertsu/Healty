import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon, Grid, Modal, Step, Label, Container, Message } from 'semantic-ui-react'
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
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';


 const AccountSettingsPage: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
    cities
  } = rootStore.commonStore;
  const {
    getAccountDetails, user, loadingUserInfo,editAccountDetails,accountForm,setAccountForm, accountInfo
  } = rootStore.userStore;

  const [loading, setLoading] = useState(false);
  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [passwordErrorMessage, setPasswordErrorMessage]= useState("")  
    const [errorMessage, setErrorMessage]= useState("")  
    const [trainerFormMessage, setTrainerFormMessage]= useState(false)  

    
    
  





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
        <Header>Hesap Bilgileri</Header>
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
          errors.displayName = 'Ad Soyad zorunlu alan'
        }
        if (!values.email) {
          errors.email = 'Email zorunlu alan'
        }

        if(!values.email || !/.+@.+\.[A-Za-z]+$/.test(values.email))
        {
          errors.email = 'Geçersiz email adresi'
        }

        if (!values.phoneNumber) {
          errors.phoneNumber = 'Telefon zorunlu alan'
        }
        if (!values.password) {
          errors.password = 'Şifre zorunlu alan'
        }
        if (!values.repassword) {
          errors.repassword = 'Şifre tekrarı zorunlu alan'
        }
        if (values.repassword !== values.password) {
          errors.repassword = 'Zorunlu alan';
          errors.password = 'Zorunlu alan';
        }
    
       
        var hasNumeric = false;
        var hasletter = false;

        if(values.password)
          for (let index = 0; index < values.password.length; index++) {
            const element = values.password[index];
            if(/^\d+$/.test(element))
              hasNumeric = true;
            if(element.match(/[a-z]/i))
              hasletter = true;
          }
        if(values.password &&  values.password != "" && (!hasNumeric || !hasletter || values.password.length<6))
         {  errors.password = 'Geçersiz şifre';
            setErrorMessage("Şifre en az 6 haneli olmalıdır, bir küçük harf ve bir rakam içermelidir.")
            setTrainerFormMessage(true);
        }
        return errors
      }}
      initialValues={accountForm!}
      render={({ handleSubmit, submitting, submitError,
        invalid,
        dirtySinceLastSubmit }) => (
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
            <Field 
            name="email" 
            placeholder="Email" 
            label="Email*" 
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
            <Form.Group widths="equal">
            <Field
              label="Şifre*"
              name="password"
              labelName="passwordLabel"
              placeholder="*********"
              type="password"
              component={TextInput}
              value={accountForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                   if(value !== accountForm.password)
                   {
                    setAccountForm({...accountForm,password: value});
                   }
                   var hasNumeric = false;
                   var hasletter = false;
         
                   for (let index = 0; index < value.length; index++) {
                     const element = value[index];
                     if(/^\d+$/.test(element))
                       hasNumeric = true;
                     if(element.match(/[a-z]/i))
                       hasletter = true;
                   }
                   if(!hasNumeric || !hasletter || value.length<6)
                    {  
                       setErrorMessage("Şifre en az 6 haneli olmalıdır, bir küçük harf ve bir rakam içermelidir.")
                       setTrainerFormMessage(true);
                   }else{
                    setTrainerFormMessage(false);
                    setErrorMessage("");
                   }

                      if(value !== accountForm.repassword && accountForm.repassword !="")
                      {
                        setPasswordErrorMessage("Girmiş olduğunuz iki şifre aynı değil")
                      }else{
                        setPasswordErrorMessage("");
                      }
                    
                }}
            </OnChange>

            <Field
              label="Şifre Tekrar*"
              name="repassword"
              placeholder="*********"
              labelName="repasswordLabel"
              type="password"
              component={TextInput}
              value={accountForm.repassword}
            />
            <OnChange name="repassword">
                {(value, previous) => {
                  if(value !== accountForm.repassword)
                  {
                    setAccountForm({...accountForm,repassword: value});
                  }
                    if(value !== accountForm.password && accountForm.password !="")
                    {
                      setPasswordErrorMessage("Girmiş olduğunuz iki şifre aynı değil")
                    }else{
                      setPasswordErrorMessage("");
                    }

                }}
            </OnChange>

            </Form.Group>
            {passwordErrorMessage!=="" && <label style={{color:"red"}}>*{passwordErrorMessage}</label>}            
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
            <Field
              name="phoneNumber"
              label="Telefon Numarası*"
              labelName="phoneLabel"
              placeholder="Telefon"
              component={PhoneNumberInput}
              value={accountForm.phoneNumber}
            //  onchange={handlePhoneNumberChange}
            />
              <OnChange name="phone">
                {(value, previous) => {
                   if(value !== accountForm.phoneNumber)
                   {
                      setAccountForm({...accountForm,phoneNumber: value});
                   }
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
                {submitError &&  !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
        
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
     accountInfo &&  (
         <>
     <div className=''>Hesap Türü:{accountInfo.role}</div>
{     accountInfo.applicationDate && <div className=''>Başvuru tarihi:{format(new Date(accountInfo.applicationDate), 'dd MMMM yyyy - HH:mm',{locale: tr})}</div>
}
<div className=''>Üyelik tarihi:{format(new Date(accountInfo.registrationDate), 'dd MMMM yyyy - HH:mm',{locale: tr})}</div>

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

export default observer(AccountSettingsPage);