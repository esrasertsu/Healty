import React, { useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { useMediaQuery } from 'react-responsive';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Divider, Form, Header,Icon, Image, Modal } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/rootStore';
import { observer } from 'mobx-react';
import TrainerForm from '../user/TrainerRegisterModal';
import ReCAPTCHA from "react-google-recaptcha";
import { AxiosResponse } from 'axios';
import ValidationError from '../../app/common/form/ValidationError';

const isValidEmail = createValidator(
  message => value => {
    if (value && !/.+@.+\.[A-Za-z]+$/.test(value)) {
      return message
    }
  },
  'Geçersiz e-posta'
)

const isValidUsername = createValidator(
  message => value => {
    if (value && (!/^[A-Za-z0-9]*$/.test(value) || /^[0-9]+$/.test(value))) {
      return message
    }
  },
  'Kullanıcı adı boşluk ve özel karakter içermemeli. En az bir harf içermelidir ve sayı kullanılabilir.'
)
const validate = combineValidators({
    email: composeValidators(
      isRequired({message: 'Email zorunlu alandır.'}),
      isValidEmail
    )(),
    username: composeValidators(
      isRequired({ message: 'Kullanıcı adı zorunlu alan.' }),
      isValidUsername
    )(),
    password: isRequired({ message: 'Şifre zorunlu alan.' })
})
interface IProps {
  location: string;
}
const RegisterForm:React.FC<IProps> = ({location}) =>{
    const rootStore = useStore();
    const { register,facebookLogin,loadingFbLogin,googleLogin,loadingGoogleLogin,submitting } = rootStore.userStore;

    const isDesktop =  useMediaQuery({ query: '(min-width: 920px)' })
    const isTablet = useMediaQuery({ query: '(max-width: 919px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const { closeModal, openModal, modal } = rootStore.modalStore;
    const recaptchaRef = React.createRef<any>();
    const [submitErr, setSubmitErr] = useState<AxiosResponse<any>|null>(null)

    const responseGoogle = (response:any) => {
      googleLogin(response.tokenId, location).catch((error) => 
        {   
          error.data.errors="Geçersiz giriş";   
          setSubmitErr(error)
        }      
        )
    };

    const handleTrainerFormClick= (e:any) => {
      setSubmitErr(null)

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
  setSubmitErr(null)
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
            <h3>Trainer register form <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>here!</span></h3>            
            <Field name="username" placeholder="*Username" component={TextInput}/>
            <Field name="displayname" placeholder="Name Surname" component={TextInput} />
            <Field name="email" type="email" placeholder="*Email" component={TextInput} />
            <Field
              name="password"
              placeholder="*Password"
              type="password"
              component={TextInput}
            />
            {submitErr && !dirtySinceLastSubmit && (
             <ValidationError errors={submitErr} />
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
              content="Register"
              circular
              basic
              fluid
            />
              <Divider horizontal>OR</Divider>
              <Button loading={loadingFbLogin} circular fluid color="facebook" className="fbtn"
            style={{marginBottom:"40px"}}
            onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              facebookLogin(location)}}>
                  <Icon name="facebook" />{" "} Sign up with Facebook
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
            />
          </Form>
        )}
      />
    );
}

export default observer(RegisterForm)