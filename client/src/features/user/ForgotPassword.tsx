import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { toast } from 'react-toastify';
import { combineValidators, composeValidators, createValidator, isRequired } from 'revalidate';
import { Button, Divider, Form, Header, Message } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import SocialLogin from './SocialLogin';
import  RegisterForm  from './RegisterForm';
import { action, runInAction } from 'mobx';
import ReCAPTCHA from 'react-google-recaptcha';



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
})

const ForgotPassword = () => {
   const [showErrorMessage, setshowErrorMessage] = useState(false);
   const [showSuccessMessage, setshowSuccessMessage] = useState(false);
   const [submitErr, setSubmitErr] = useState()

   const recaptchaRef = React.createRef<any>();


   
const handleSubmit = async(values:IUserFormValues) =>{
  debugger;
    recaptchaRef.current.executeAsync().then((token:string) =>
    {
      setshowErrorMessage(false);
      setshowSuccessMessage(false);


      values.reCaptcha = token;
      agent.User.resetPasswordRequest(values.email, values.reCaptcha).then(action((res:boolean) => {
        debugger;
        if(res === true)
        {
            setshowErrorMessage(false);
           setshowSuccessMessage(true);
        }else{
            setshowSuccessMessage(false);
           setshowErrorMessage(true);
        }
    }))  .catch((error) => 
    setSubmitErr(error)
    )
    })
  
}

   return (
      <FinalForm
        onSubmit={handleSubmit}
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
            {submitErr && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitErr} text='Geçersiz email adresi' />
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
                        <p>Şifre yenileme linki gönderdik - Lütfen epostanızı kontrol edin</p>
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


export default observer(ForgotPassword);