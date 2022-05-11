import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Container, Divider, Form, Header, Icon, Image, Modal } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import ForgotPassword from './ForgotPassword';
import SocialLogin from './SocialLogin';
import GoogleLogin from 'react-google-login';
import ReCAPTCHA from "react-google-recaptcha";
import { action, runInAction } from 'mobx';
import  RegisterForm  from './RegisterForm';
import { useMediaQuery } from 'react-responsive';


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
    const { login, fbLogin, loadingFbLogin ,setResendEmailVeriMessage, resendEmailVeriMessage,
    googleLogin,loadingGoogleLogin} = rootStore.userStore;
    const { closeModal, openModal, modal } = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
  
    const [email, setEmail] = useState("");
    const recaptchaRef = React.createRef<any>();
const [submitErr, setSubmitErr] = useState()
    useEffect(() => {
      setResendEmailVeriMessage(false);
      
    }, [modal.open])
    
const handleResetPassword = (e:any) => {
  e.stopPropagation();
  if(modal.open) closeModal();

      openModal("Şifre Yenileme", <>
       <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
      <Modal.Description>
      <ForgotPassword />
      </Modal.Description>
      </>,true,
      "","blurring",true) 
  }

  const handleEmailResend = () => {
    agent.User.resendVerifyEmailConfirm(email as string).then(() => {
        closeModal();
        toast.success('Doğrulama linki yeniden gönderildi - Lütfen e-posta kutunuzu kontrol edin');
    }).catch((error) => console.log(error));
}
    const responseGoogle = (response:any) => {
      googleLogin(response.tokenId, location).catch((error) => 
        {   
          error.data.errors="Geçersiz giriş";   
          setSubmitErr(error)
        }      
        )
    };


  
   
const handleLogin = async(values:IUserFormValues) =>{

     recaptchaRef.current.executeAsync().then((token:string) => {
        values.reCaptcha = token;
              
        login(values,location)
        .catch((error) => 
        setSubmitErr(error)
        )
      })
 }


  const openRegisterModal = (e:any) => {
        e.stopPropagation();
        if(modal.open) closeModal();
        openModal("Üye Kaydı", <>
        <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
        <Modal.Description>
        <RegisterForm location={location} />
        </Modal.Description>
        </>,true,
          "","blurring",true) 
      }


    return (

      <FinalForm
        onSubmit={handleLogin}
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
              <a className="forgotPasswordLink" style={{cursor:"pointer", textDecoration:"underline",float:"right"}} onClick={handleResetPassword}>Şifremi Unuttum!</a>
            
            {submitErr && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitErr} text='Geçersiz email adresi / şifre' />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              className='orangeBtn'
              circular
              content="Giriş"
              fluid
            />
            <Divider horizontal>veya</Divider>
            <Button
              circular
              basic
              color="orange"
              fluid
              onClick={openRegisterModal}
            >
              Kayıt ol
            </Button>
            <br></br>
            <SocialLogin loading={loadingFbLogin} fbCallback={(resonse:any) => fbLogin(resonse,location)} />
            <br></br>
            {/* <GoogleLogin
              clientId="1086747484183-2avit5lboliou5c8nt90tjf2ueu5f8bk.apps.googleusercontent.com"
              render={renderProps => (
                <Button loading={loadingGoogleLogin} fluid color="google plus" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                  <Icon name="google" />{" "} Google ile giriş yap
                </Button>
              )}
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            /> */}
             <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY!}
            //  onloadCallback={recaptchaLoaded}
            //  expiredCallback={expiredCaptcha}
            />

          </Form>
        )}
      />
    );
}


export default observer(LoginForm);