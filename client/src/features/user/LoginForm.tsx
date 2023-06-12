import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Container, Divider, Form, Header, Icon, Image, Modal } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/rootStore';
import ForgotPassword from './ForgotPassword';
import SocialLogin from './SocialLogin';
import GoogleLogin from 'react-google-login';
import ReCAPTCHA from "react-google-recaptcha";
import  RegisterForm  from './RegisterForm';
import { useMediaQuery } from 'react-responsive';
import { AxiosResponse } from 'axios';


const isValidEmailOrUserName = createValidator(
  message => value => {
    if (value && !/^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/.test(value)) {
      return message
    }
  },
  'Geçersiz giriş'
)

const validate = combineValidators({
  emailOrUserName: composeValidators(
    isRequired({message: '"Email veya kullanıcı" adı zorunlu alandır.'}),
    isValidEmailOrUserName
  )(),
  password: isRequired({ message: 'Şifre zorunlu alan.' })
})

interface IProps {
  location: string;
} 

const LoginForm:React.FC<IProps> = ({location}) => {
    const rootStore = useStore();
    const { login, fbLogin, loadingFbLogin ,setResendEmailVeriMessage, resendEmailVeriMessage,
    googleLogin,loadingGoogleLogin,submitting,facebookLogin} = rootStore.userStore;
    const { closeModal, openModal, modal } = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
  
    const [email, setEmail] = useState("");
    const recaptchaRef = React.createRef<any>();
const [submitErr, setSubmitErr] = useState<AxiosResponse<any> | null>(null)

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
    }).catch((error) =>{
      toast.success('Doğrulama linki gönderilemedi!');
       console.log(error)});
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

  setSubmitErr(null)

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
          submitError,
          invalid,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Giriş Yap"
              textAlign="center"
            />
            <label id="lbl_Email">Email / Kullanıcı adı*</label>
            <Field labelName="lbl_Email" name="emailOrUserName" placeholder="Email veya kullanıcı adı" component={TextInput}
            />
              <OnChange name="emailOrUserName">
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
              disabled={(invalid)}
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
            <Divider />
            <Button loading={loadingFbLogin} circular fluid color="facebook" className="fbtn"
            style={{marginBottom:"40px"}}
            onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              facebookLogin(location)}}>
                  <Icon name="facebook" />{" "} Facebook ile giriş yap
                </Button>
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