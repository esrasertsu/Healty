import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Divider, Form, Header, Image, Modal } from 'semantic-ui-react';
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
    const { login, fbLogin, loadingFbLogin } = rootStore.userStore;
    const { closeModal, openModal, modal } = rootStore.modalStore;


    
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

            <label id="lbl_Password">Şifre*</label>
            <Field
              labelName="lbl_Password"
              name="password"
              placeholder="*******"
              type="password"
              component={TextInput}
            />
            <div className="forgotPasswordLink">
               <p onClick={(e:any) => handleResetPassword(e)}>Şifremi Unuttum</p>
            </div>
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