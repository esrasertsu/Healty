import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Divider, Form, Header, Image, Modal } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import ForgotPassword from './ForgotPassword';
import SocialLogin from './SocialLogin';

const validate = combineValidators({
  email: isRequired({ message: 'Email zorunlu alan.' }),
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
              as="h2"
              content="Afitapp'a Giriş Yap"
              color="teal"
              textAlign="center"
            />
            <Field type="email" name="email" placeholder="*Email" component={TextInput}
            />
            <Field
              name="password"
              placeholder="*Şifre"
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
            <SocialLogin loading={loadingFbLogin} fbCallback={fbLogin} />

          </Form>
        )}
      />
    );
}


export default observer(LoginForm);