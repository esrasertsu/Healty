import { FORM_ERROR } from 'final-form';
import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { useMediaQuery } from 'react-responsive';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Divider, Form, Header,Icon, Image, Modal } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import SocialLogin from './SocialLogin';
import GoogleLogin from 'react-google-login';
import { observer } from 'mobx-react';
import TrainerForm from '../user/TrainerRegisterModal';
import ReCAPTCHA from "react-google-recaptcha";
import { runInAction } from 'mobx';

const isValidEmail = createValidator(
  message => value => {
    if (value && !/.+@.+\.[A-Za-z]+$/.test(value)) {
      return message
    }
  },
  'Geçersiz e-posta'
)
const validate = combineValidators({
    username: isRequired({ message: 'Kullanıcı adı zorunlu alan.' }),
    email: composeValidators(
      isRequired({message: 'Email zorunlu alandır.'}),
      isValidEmail
    )(),
    password: isRequired({ message: 'Şifre zorunlu alan.' })
})
interface IProps {
  location: string;
}
const RegisterForm:React.FC<IProps> = ({location}) =>{
    const rootStore = useContext(RootStoreContext);
    const { register,fbLogin,loadingFbLogin,googleLogin,loadingGoogleLogin } = rootStore.userStore;

    const isDesktop =  useMediaQuery({ query: '(min-width: 920px)' })
    const isTablet = useMediaQuery({ query: '(max-width: 919px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const { closeModal, openModal, modal } = rootStore.modalStore;
    const recaptchaRef = React.createRef<any>();
    const [submitErr, setSubmitErr] = useState()

    const responseGoogle = (response:any) => {
      googleLogin(response.tokenId, location).catch((error) => 
        {   
          error.data.errors="Geçersiz giriş";   
          setSubmitErr(error)
        }      
        )
    };




    const handleTrainerFormClick= (e:any) => {
    
      e.stopPropagation();
      if(modal.open) closeModal();

          openModal("Uzman Başvuru Formu", <>
          <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/contactus.jpg' wrapped />
          <Modal.Description>
          <TrainerForm />
          </Modal.Description>
          </>,true,
          "","blurring",true
          ) 
         
      }



      
const handleRegister = async(values:IUserFormValues) =>{

  recaptchaRef.current.executeAsync().then((token:string) => {
     values.reCaptcha = token;
           
     register(values,location)
     .catch((error) => 
     setSubmitErr(error)
     )
   })
}


    return (
      <FinalForm
      onSubmit={handleRegister}

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
              content="Yeni Üye"
              textAlign="center"
            />
            <h4>Uzman başvuru için <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>tıkla!</span></h4>            <Field name="username" placeholder="*Kullanıcı Adı" component={TextInput}/>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} />
            <Field name="email" type="email" placeholder="*Email" component={TextInput} />
            <Field
              name="password"
              placeholder="*Şifre"
              type="password"
              component={TextInput}
            />
            {submitErr && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitErr} text='Geçersiz email adresi / şifre' />
            )}
            <div style={
              isMobile ? {maxWidth:"100%", marginBottom:"10px", textAlign:"right"} :
              isTablet ? {maxWidth:"303px", marginBottom:"10px", textAlign:"right"}:
              isDesktop ? {maxWidth:"375px", marginBottom:"10px", textAlign:"right"} :{}
            }>Hesap oluşturarak <a href="/uyelik_ve_gizlilik_sozlesmesi" target="_blank" style={{cursor:"pointer"}}>Gizlilik Sözleşmesi</a> ve <a href="/kullanim_sartlari" target="_blank" style={{cursor:"pointer"}}>Site Kullanım Şartları</a>'nı kabul etmiş olursunuz. </div>
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color="blue"
              content="Kayıt Ol"
              circular
              basic
              fluid
            />
              <Divider horizontal>veya</Divider>
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
            />
          </Form>
        )}
      />
    );
}

export default observer(RegisterForm)