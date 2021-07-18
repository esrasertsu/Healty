import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Grid, Header, Icon, Image, Label, List, Message, Placeholder, Segment } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';


const validate = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password')
})
const FormPage1:React.FC = () =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering,trainerRegisteredSuccess } = rootStore.userStore;
    const {trainerForm, setTrainerForm} = rootStore.userStore;

    const [showM, setShowM] = useState(false);


   const handleSubmitTrainerForm = (values:ITrainerFormValues) =>{
    let edittedValues = {
      ...values,
    }
    //   registerTrainer(edittedValues,location)
    //   .catch((error:any) => (
    //     settrainerRegisteringFalse(),
    //     setShowM(true),
    //     console.log(error)
    //   ))
   }
    return (
      <>
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Sadece 1 dakika</Message.Header>
          Başvurunuzu değerlendirmek üzere yüklüyoruz.
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
     { showM && <Message
      error
      header='Başvuru formunuz hatalı!'
      content='Lütfen formu eksiksiz ve doğru şekilde doldurunuz.'
    />}
        <FinalForm
        onSubmit={(values: ITrainerFormValues) =>
          handleSubmitTrainerForm(values)
        }
        validate={validate}
        initialValues={trainerForm!}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Uzman Kayıt Formu"
              color="teal"
              textAlign="center"
            />
           <label>Kullanıcı Adı*</label>
            <Field name="username" placeholder="Kullanıcı Adı" component={TextInput} value={trainerForm.username}/>
            <OnChange name="username">
                {(value, previous) => {
                  debugger;
                    if(value !== trainerForm.username)
                    {
                        setTrainerForm({...trainerForm,username: value});
                    }
                }}
            </OnChange>
            <label>Ad Soyad*</label>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} value={trainerForm.displayname}/>
            <OnChange name="displayname">
                {(value, previous) => {
                    if(value !== trainerForm.displayname)
                    {
                        setTrainerForm({...trainerForm,displayname: value});
                    }
                }}
            </OnChange>
            <label>Email*</label>
            <Field name="email" placeholder="Email" component={TextInput} value={trainerForm.email}/>
            <OnChange name="email">
                {(value, previous) => {
                    if(value !== trainerForm.email)
                    {
                        setTrainerForm({...trainerForm,email: value});
                    }
                }}
            </OnChange>
            <label>Şifre*</label>
            <Field
              name="password"
              placeholder="Şifre"
              type="password"
              component={TextInput}
              value={trainerForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                    if(value !== trainerForm.password)
                    {
                        setTrainerForm({...trainerForm,password: value});
                    }
                }}
            </OnChange>
            {submitError && (
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