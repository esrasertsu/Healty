import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { toast } from 'react-toastify';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Divider, Form, Header, Message } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import SocialLogin from './SocialLogin';

const validate = combineValidators({
    email: isRequired({ message: 'Email zorunlu alan.' })
})

const ForgotPassword = () => {
    const rootStore = useContext(RootStoreContext);
   const { openModal, closeModal} = rootStore.modalStore;
   const [showErrorMessage, setshowErrorMessage] = useState(false);
   const [showSuccessMessage, setshowSuccessMessage] = useState(false);

   

   return (
      <FinalForm
        onSubmit={(values: IUserFormValues) =>
            agent.User.resetPasswordRequest(values.email as string).then((res:boolean) => {
                debugger;
                if(res === true)
                {
                   setshowSuccessMessage(true);
                }else{
                   setshowErrorMessage(true);
                }
            })
          .catch((error) => ({
            [FORM_ERROR]: error,
          }))
        }
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h3"
              content="Şifre Yenileme"
              color="teal"
              textAlign="center"
            />
            <p>Sistemde kayıtlı olan email adresinize bir şifre yenileme linki göndereceğiz. Lütfen sistemde kayıtlı email adresinizi giriniz.</p>
            <Field type="email" name="email" placeholder="Email" component={TextInput}/>
            {submitError && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError} text='Geçersiz email adresi' />
            )}
            {
                showErrorMessage && (
                    <Message negative>
                       <p>Sistemde bu email adresiyle kayıtlı kullanıcı bulunamadı.</p>
                   </Message>
                )
            }
            {
                showSuccessMessage && (
                    <Message positive>
                        <p>Sistemde email adresinizi bulduk ve şifre yenileme linki gönderdik - Lütfen epostanızı kontrol edin</p>
                    </Message>
                )
            }
            {
                !showSuccessMessage && 
                <Button
                    disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                    loading={submitting}
                    color='teal'
                    content="Gönder"
                    fluid
                    />
            }
            
           
          </Form>
        )}
      />
    );
}


export default observer(ForgotPassword);