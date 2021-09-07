import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header, Icon,  Image,  Message, Modal, } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { ITrainerCreationFormValues, ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive'
import { action } from 'mobx';
import FormPage2 from './FormPage2';
import PhoneNumberInput from '../../app/common/form/PhoneNumberInput';


const validate = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password'),
    phone: isRequired('phone')

})
const FormPage1:React.FC = () =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering,trainerRegisteredSuccess, tranierCreationForm,setTrainerCreationForm,isUserNameAvailable,
    setTrainerFormMessage, trainerFormMessage,errorMessage } = rootStore.userStore;
   // trainerForm, setTrainerForm,
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


    // const handlePhoneNumberChange = (value:any) => {
    //   setTrainerCreationForm({...tranierCreationForm,phone: value});
    // }

   const handleSubmitTrainerForm = (values:ITrainerCreationFormValues) =>{
    debugger;

    isUserNameAvailable(tranierCreationForm.username, tranierCreationForm.email).then(action((response) => {

      if(response)
      {
        if(modal.open) closeModal();

        openModal("Uzman Başvuru Formu", <>
        <Modal.Description>
        <FormPage2 />
        </Modal.Description>
        </>,false,
      "","", false) 
      }
    }
    )).catch((error) => (
      {
      [FORM_ERROR]: error,
    }))
    //   .catch((error:any) => (
    //     settrainerRegisteringFalse(),
    //     setShowM(true),
    //     console.log(error)
    //   ))
   }


  

    return (
      <>
      <Header
              as="h2"
              content="Uzman Kayıt Formu"
              color="teal"
              textAlign="center"
            />
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Sadece 1 dakika</Message.Header>
          Girmiş olduğunuz bilgileri kontrol ediyoruz.
        </Message.Content>
      </Message>
      </> :
      trainerRegisteredSuccess ? 
      <Message
      success
      header='Başvuru formunuz iletildi!'
      content='En yakın zamanda email adresinize bilgilendirme yapılacaktır.'
    />
      :
      <>
     { trainerFormMessage && <Message
      error
      header=''
      content={errorMessage}
    />}
        <FinalForm
        onSubmit={(values: ITrainerCreationFormValues) =>
          handleSubmitTrainerForm(values)
        }
        validate={values => {
          const errors:any = {};
          debugger;
          if (!values.username) {
            errors.username = 'Zorunlu alan'
          }
          if (!values.displayname) {
            errors.displayname = 'Zorunlu alan'
          }
          if (!values.email) {
            errors.email = 'Zorunlu alan'
          }
          // if (!values.phone) {
          //   errors.phone = 'Zorunlu alan'
          // }
          if (!values.password) {
            errors.password = 'Zorunlu alan'
          }
          return errors
        }}
        initialValues={tranierCreationForm}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          dirtySinceLastSubmit
        }) => (
          <Form onSubmit={handleSubmit} error>
            
           <label>Kullanıcı Adı*</label>
            <Field name="username" placeholder="Kullanıcı Adı" component={TextInput} value={tranierCreationForm.username}/>
            <OnChange name="username">
                {(value, previous) => {
                  debugger;
                    if(value !== tranierCreationForm.username)
                    {
                      setTrainerCreationForm({...tranierCreationForm,username: value});
                    }
                }}
            </OnChange>
            <label>Ad Soyad*</label>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} value={tranierCreationForm.displayname}/>
            <OnChange name="displayname">
                {(value, previous) => {
                    if(value !== tranierCreationForm.displayname)
                    {
                      setTrainerCreationForm({...tranierCreationForm,displayname: value});
                    }
                }}
            </OnChange>
            <label>Email*</label>
            <Field name="email" placeholder="Email" component={TextInput} value={tranierCreationForm.email}/>
            <OnChange name="email">
                {(value, previous) => {
                    if(value !== tranierCreationForm.email)
                    {
                      setTrainerCreationForm({...tranierCreationForm,email: value});
                    }
                }}
            </OnChange>
            {/* <label>Telefon Numarası*</label>
            <Field
              name="phone"
              placeholder="Telefon"
              component={PhoneNumberInput}
              value={tranierCreationForm.phone}
              onchange={handlePhoneNumberChange}
            /> */}
            <label>Şifre*</label>
            <Field
              name="password"
              placeholder="Şifre"
              type="password"
              component={TextInput}
              value={tranierCreationForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                    if(value !== tranierCreationForm.password)
                    {
                      setTrainerCreationForm({...tranierCreationForm,password: value});
                    }
                }}
            </OnChange>
            {submitError &&  !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
            <Button
              disabled={(invalid)}
              loading={submitting}
              color='teal'
              content="Devam"
              fluid
            />
          </Form>
        )}
      />
      </>
       }
    
      </>
    );
}


export default observer(FormPage1)