import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Grid, Header, Icon,  Image,  Message, Modal, } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { ITrainerCreationFormValues, ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive'
import { action } from 'mobx';
import FormPage2 from './FormPage2';
import PhoneNumberInput from '../../app/common/form/PhoneNumberInput';
import { history } from '../..';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';


// const validate = combineValidators({
//     username: isRequired('username'),
//     displayname: isRequired('display name'),
//     email: isRequired('email'),
//     password: isRequired('password'),
//     repassword: isRequired('repassword'),
//     phone: isRequired('phone')

// })
const FormPage1:React.FC = () =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering,trainerRegisteredSuccess, tranierCreationForm,setTrainerCreationForm,isUserNameAvailable,
    setTrainerFormMessage, trainerFormMessage,errorMessage,setErrorMessage } = rootStore.userStore;
   // trainerForm, setTrainerForm,
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const [passwordErrorMessage, setPasswordErrorMessage]= useState("")  
    const [contractErrorMessage, setcontractErrorMessage] = useState("")
    const [showPasswordModal, setshowPasswordModal] = useState(false)
    const [otpInput, setOtpInput] = useState("")
    const [optInputDisabled, setoptInputDisabled] = useState(false)
    const [countDownDate, setCountDownDate]= useState(Date.now() +180000);

   const handleSubmitTrainerForm = (values:ITrainerCreationFormValues) =>{

    if(!values.hasSignedContract)
    {
      setcontractErrorMessage("Aydınlatma metni'ni okuyup onaylamanız gerekmektedir.")
    }else{

       isUserNameAvailable(tranierCreationForm.username, tranierCreationForm.email).then(action((response) => {

        if(response)
        {
          agent.User.sendSms(values.phone as string).then(() => {
            if(modal.open) closeModal();
            setoptInputDisabled(false);
            setCountDownDate(Date.now() +180000);
            setshowPasswordModal(true);
        }).catch((error) => console.log(error));
        }
      }
      )).catch((error) => (
        {
        [FORM_ERROR]: error,
      }))
    }
   }

   const handleSubmitOtpCode = () =>{
     agent.User.sendSmsVerification(tranierCreationForm.phone,otpInput).then((res) => {

      if(res){
        if(modal.open) closeModal();
        setshowPasswordModal(false);
        setOtpInput("");
        setoptInputDisabled(false);
        setCountDownDate(Date.now());
        history.push('/trainerRegister');
        
      }else{
        toast.error("Yanlış kod gönderdiniz. Lütfen tekrar deneyin.")
      }
      }).catch((error) => console.log(error));
   }

   const renderer = ({ days,hours, minutes, seconds, completed }: any) => {
    if (completed || (seconds===0 && minutes ===0)) {
           setoptInputDisabled(true);

            return (
            <a style={{cursor:"pointer", textDecoration:"underline"}} 
            onClick={()=>agent.User.sendSms(tranierCreationForm.phone as string)}>Doğrulama Kodunu Tekrar Gönder</a>
            );

    } else {
      return (
      <>
        <span style={{marginRight:"10px", color:"#429dad"}}>Kalan süre</span>
        <span style={{color:"#429dad"}}>{minutes + ":" + seconds}</span>   
        
       </>
       );
    }

   }

   if(showPasswordModal)
   {
     return(
    <Modal
        open={showPasswordModal} 
        onClose={() => setshowPasswordModal(false)}
        closeIcon
        size={"tiny"}
        closeOnEscape={true}
        closeOnDimmerClick={false}>
        <Modal.Content>
        <Header style={{margin:"0 0 30px 0"}} as="h3" content="SMS Doğrulama" />
          <Modal.Description style={{margin:"20px"}}>
          <Grid stackable>
          <Grid.Row>
            <Grid.Column width="16" style={{display:"flex", justifyContent:"center", alignItems:"center"}} >
            <Image style={{maxHeight:"220px"}} src={"/icons/otp.jpg"} />
            </Grid.Column>
            <Grid.Column width="16" style={{display:"flex", textAlign:"center",justifyContent:"space-between", alignItems:"center", flexDirection:"column"}}>
            <p style={{fontSize:"16px", marginTop:"30px"}}>Lütfen telefonunuza SMS yoluyla gelen 5 haneli kodu aşağıdaki alana giriniz.</p>
            <OtpInput
              value={otpInput}
              isDisabled={optInputDisabled}
              onChange={(val:string)=>setOtpInput(val)}
              numInputs={5}
              isInputNum={true}
              containerStyle={"otpInput-container"}
              inputStyle={"otpInput-input"}
              focusStyle={"otpInput-input-focus"}
            />
              <div style={{ marginTop:"20px"}}> 
              <Countdown 
              date={countDownDate} 
              renderer={renderer}
              intervalDelay={0}
              precision={3}
              
                />
              </div>
              <Button 
              disabled={optInputDisabled} 
              style={{ marginTop:"20px"}} 
              positive 
              fluid 
              onClick={handleSubmitOtpCode}
              content="Kodu Onayla"></Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
         
          </Modal.Description>
        </Modal.Content>
      </Modal>
     )
    
   }

  

    return (
      <>
    
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Sadece 1 dakika</Message.Header>
          Girmiş olduğunuz bilgileri kontrol ediyoruz.
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
     { trainerFormMessage && <Message
      error
      header=''
      content={errorMessage}
    />}
        <FinalForm
        onSubmit={(values: ITrainerCreationFormValues) =>
          handleSubmitTrainerForm(values)
        }
        validate={values => {
          const errors:any = {};

          if (!values.username) {
            errors.username = 'Zorunlu alan'
          }
          if (!values.displayname) {
            errors.displayname = 'Zorunlu alan'
          }
          if (!values.email) {
            errors.email = 'Zorunlu alan'
          }
          if (!values.phone) {
            errors.phone = 'Zorunlu alan'
          }
          if (!values.password) {
            errors.password = 'Zorunlu alan'
          }
          if (!values.repassword) {
            errors.repassword = 'Zorunlu alan'
          }
          if (values.repassword !== values.password) {
            errors.repassword = 'Zorunlu alan';
            errors.password = 'Zorunlu alan';
          }
          if (!values.hasSignedContract) {
            errors.hasSignedContract = 'Zorunlu alan'
          }
          debugger;
          var hasNumeric = false;
          var hasletter = false;

          if(values.password)
            for (let index = 0; index < values.password.length; index++) {
              const element = values.password[index];
              if(/^\d+$/.test(element))
                hasNumeric = true;
              if(element.match(/[a-z]/i))
                hasletter = true;
            }
          if(values.password &&  values.password != "" && (!hasNumeric || !hasletter || values.password.length<6))
           {  errors.password = 'Geçersiz şifre';
              setErrorMessage("Şifre en az 6 haneli olmalıdır, bir küçük harf ve bir rakam içermelidir.")
              setTrainerFormMessage(true);
          }
          return errors
        }}
        initialValues={tranierCreationForm}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          dirtySinceLastSubmit
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Field 
            name="username" 
            label="Kullanıcı Adı*" 
            labelName="usernameLabel" 
            placeholder="Kullanıcı Adı" 
            component={TextInput} 
            value={tranierCreationForm.username}/>
            <OnChange name="username">
                {(value, previous) => {

                if(value !== tranierCreationForm.username)
                    {
                      setTrainerCreationForm({...tranierCreationForm,username: value});
                    }
                }}
            </OnChange>
            <Field 
            name="displayname" 
            label="Ad Soyad*" 
            placeholder="Ad Soyad" 
            labelName="displayNameLabel" 
            component={TextInput} 
            value={tranierCreationForm.displayname}
            />
            <OnChange name="displayname">
                {(value, previous) => {
                    if(value !== tranierCreationForm.displayname)
                    {
                      setTrainerCreationForm({...tranierCreationForm,displayname: value});
                    }
                }}
            </OnChange>
            <Form.Group widths="equal">
            <Field 
            name="email" 
            type="email"
            placeholder="Email" 
            label="Email*" 
            labelName="emailLabel" 
            component={TextInput} 
            value={tranierCreationForm.email}
            />
            <OnChange name="email">
                {(value, previous) => {
                    if(value !== tranierCreationForm.email)
                    {
                      setTrainerCreationForm({...tranierCreationForm,email: value});
                    }
                }}
            </OnChange>
            <Field
              name="phone"
              label="Telefon Numarası*"
              labelName="phoneLabel"
              placeholder="Telefon"
              component={PhoneNumberInput}
              value={tranierCreationForm.phone}
            //  onchange={handlePhoneNumberChange}
            />
              <OnChange name="phone">
                {(value, previous) => {
                   if(value !== tranierCreationForm.phone)
                   {
                      setTrainerCreationForm({...tranierCreationForm,phone: value});
                   }
                }}
            </OnChange>
            </Form.Group>
            <Form.Group widths="equal">
            <Field
              label="Şifre*"
              name="password"
              labelName="passwordLabel"
              placeholder="*********"
              type="password"
              component={TextInput}
              value={tranierCreationForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                   if(value !== tranierCreationForm.password)
                   {
                      setTrainerCreationForm({...tranierCreationForm,password: value});
                   }
                   var hasNumeric = false;
                   var hasletter = false;
         
                   for (let index = 0; index < value.length; index++) {
                     const element = value[index];
                     if(/^\d+$/.test(element))
                       hasNumeric = true;
                     if(element.match(/[a-z]/i))
                       hasletter = true;
                   }
                   if(!hasNumeric || !hasletter || value.length<6)
                    {  
                       setErrorMessage("Şifre en az 6 haneli olmalıdır, bir küçük harf ve bir rakam içermelidir.")
                       setTrainerFormMessage(true);
                   }else{
                    setTrainerFormMessage(false);
                    setErrorMessage("");
                   }

                      if(value !== tranierCreationForm.repassword && tranierCreationForm.repassword !="")
                      {
                        setPasswordErrorMessage("Girmiş olduğunuz iki şifre aynı değil")
                      }else{
                        setPasswordErrorMessage("");
                      }
                    
                }}
            </OnChange>

            <Field
              label="Şifre Tekrar*"
              name="repassword"
              placeholder="*********"
              labelName="repasswordLabel"
              type="password"
              component={TextInput}
              value={tranierCreationForm.repassword}
            />
            <OnChange name="repassword">
                {(value, previous) => {
                  if(value !== tranierCreationForm.repassword)
                  {
                   setTrainerCreationForm({...tranierCreationForm,repassword: value});
                  }
                    if(value !== tranierCreationForm.password && tranierCreationForm.password !="")
                    {
                      setPasswordErrorMessage("Girmiş olduğunuz iki şifre aynı değil")
                    }else{
                      setPasswordErrorMessage("");
                    }

                }}
            </OnChange>

            </Form.Group>
            {passwordErrorMessage!=="" && <label style={{color:"red"}}>*{passwordErrorMessage}</label>}            

            {submitError &&  !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}



           <div style={!isMobile ? {display:"flex", justifyContent:"space-between", alignItems:"center"} : {}}>
                  <div style={{margin:"30px 0"}}>
                        <Field
                        name="hasSignedContract"
                        component="input"
                        type="checkbox"
                        initialValue={tranierCreationForm.hasSignedContract}
                        width={4}
                        format={v =>v === true}
                        parse={v => (v ? true : false) }
                      />&nbsp;&nbsp;
                      <span><a style={{cursor:"pointer"}} onClick={()=>{}}>Aydınlatma metni</a>'ni okudum ve onayladım.</span> 
                       {contractErrorMessage!=="" && <label style={{color:"red"}}>{contractErrorMessage}</label>}    
                      <OnChange name="hasSignedContract">
                  {(value, previous) => {
                      setTrainerCreationForm({...tranierCreationForm, hasSignedContract:value});
                  }}
                  </OnChange>
                  </div>
            <Button
              disabled={(invalid)}
              loading={submitting}
              content="Devam"
              positive
              fluid={isMobile}
              style={{width:"150px"}}
            />
          </div>

          </Form>
        )}
      />
      </>
       }
    
      </>
    );
}


export default observer(FormPage1)