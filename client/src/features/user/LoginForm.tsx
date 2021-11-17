import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Container, Divider, Form, Header, Image, Modal } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import ForgotPassword from './ForgotPassword';
import SocialLogin from './SocialLogin';

const isValidEmail = createValidator(
  message => value => {
    if (value && !/.+@.+\.[A-Za-z]+$/.test(value)) {
      return message
    }
  },
  'Geçersiz e-posta'
)

const validate = combineValidators({
  email: composeValidators(
    isRequired({message: 'Email zorunlu alandır.'}),
    isValidEmail
  )(),
  password: isRequired({ message: 'Şifre zorunlu alan.' })
})

interface IProps {
  location: string;
} 

const LoginForm:React.FC<IProps> = ({location}) => {
    const rootStore = useContext(RootStoreContext);
    const { login, fbLogin, loadingFbLogin ,setResendEmailVeriMessage, resendEmailVeriMessage} = rootStore.userStore;
    const { closeModal, openModal, modal } = rootStore.modalStore;

    const [email, setEmail] = useState("");

    useEffect(() => {
      setResendEmailVeriMessage(false);
      
    }, [modal.open])
    
const handleResetPassword = (e:any) => {
  e.stopPropagation();
  if(modal.open) closeModal();

      openModal("Şifre Yenileme", <>
      <Image size='large' src='/assets/Login1.png' wrapped />
      <Modal.Description>
      <ForgotPassword />
      </Modal.Description>
      </>,true,
      "") 
  }

  const handleEmailResend = () => {
    debugger;
    agent.User.resendVerifyEmailConfirm(email as string).then(() => {
        closeModal();
        toast.success('Doğrulama linki yeniden gönderildi - Lütfen e-posta kutunuzu kontrol edin');
    }).catch((error) => console.log(error));
}

    return (

      <FinalForm
        onSubmit={(values: IUserFormValues) => 
          login(values,location)
          .catch((error) => ({
            [FORM_ERROR]: error
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
              as="h2"
              content="Giriş Yap"
              textAlign="center"
            />
            <label id="lbl_Email">Email*</label>
            <Field labelName="lbl_Email" type="email" name="email" placeholder="Email" component={TextInput}
            />
              <OnChange name="email">
                {(value, previous) => {
                   
                      setEmail(value);
                      setResendEmailVeriMessage(false);
                }}
            </OnChange>

            <label id="lbl_Password">Şifre*</label>
            <Field
              labelName="lbl_Password"
              name="password"
              placeholder="*******"
              type="password"
              component={TextInput}
            />
            {resendEmailVeriMessage &&
                <a className="forgotPasswordLink" style={{cursor:"pointer", textDecoration:"underline"}} onClick={handleEmailResend}>Yeniden email doğrulama linki gönder!</a>
            }
              <a className="forgotPasswordLink" style={{cursor:"pointer", textDecoration:"underline"}} onClick={handleResetPassword}>Şifremi Unuttum!</a>

            
            {submitError && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError} text='Geçersiz email adresi / şifre' />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content="Giriş"
              fluid
            />
            <Divider horizontal>veya</Divider>
            <SocialLogin loading={loadingFbLogin} fbCallback={(resonse:any) => fbLogin(resonse,location)} />

          </Form>
        )}
      />
    );
}


export default observer(LoginForm);