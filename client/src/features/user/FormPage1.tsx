import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Confirm, Form, Grid, Header, Icon,  Image,  Message, Modal, Segment, } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { ITrainerCreationFormValues, ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive'
import { action, runInAction } from 'mobx';
import ReCAPTCHA from "react-google-recaptcha";
import PhoneNumberInput from '../../app/common/form/PhoneNumberInput';
import { history } from '../..';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { Category, ICategory } from '../../app/models/category';


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
    const { trainerRegistering, tranierCreationForm,setTrainerCreationForm,userNameAndPhoneCheck,
    setTrainerFormMessage, trainerFormMessage,errorMessage,setErrorMessage,registerWaitingTrainer } = rootStore.userStore;
   // trainerForm, setTrainerForm,
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const [passwordErrorMessage, setPasswordErrorMessage]= useState("")  
    const [contractErrorMessage, setcontractErrorMessage] = useState("")
    const [showPasswordModal, setshowPasswordModal] = useState(false)
    const [loadingSmsModal, setLoadingSmsModal] = useState(false)

    const [otpInput, setOtpInput] = useState("")
    const [optInputDisabled, setoptInputDisabled] = useState(false)
    const [countDownDate, setCountDownDate]= useState(Date.now() +180000);
    const [userConfirmOpen, setUserConfirmOpen] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
    const {allCategoriesOptionList} = rootStore.categoryStore;

    const recaptchaRef = React.createRef<any>();

    useEffect(() => {
      allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
        setCategoryOptions(categoryOptions => [...categoryOptions, new Category({key: option.key, value: option.value, text: option.text})])
    ));
    }, [allCategoriesOptionList])

   const handleSubmitTrainerForm = async(values:ITrainerCreationFormValues) =>{
    
    if(!values.hasSignedContract)
    {
      setcontractErrorMessage("Aydınlatma metni'ni okuyup onaylamanız gerekmektedir.")
    }else{
      const token = await recaptchaRef.current.executeAsync();
      runInAction(() =>{
        userNameAndPhoneCheck(tranierCreationForm.username, tranierCreationForm.email, tranierCreationForm.phone,token)
        .then(action((response) => {
          if(response)
          {
              if(modal.open) closeModal();
              setoptInputDisabled(false);
              setCountDownDate(Date.now() +180000);
              setshowPasswordModal(true);
          }
        }
        )).catch((error) => 
          (
          {
          [FORM_ERROR]: error,
        }))
      })
     
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
        setUserConfirmOpen(true);
      }else{
        toast.error("Yanlış kod gönderdiniz. Lütfen tekrar deneyin.")
      }
      }).catch((error) => toast.error(error));
   }

   const handleSubmitWaitingTrainer = () =>{
        registerWaitingTrainer(tranierCreationForm)
   }



   const handleCategoryChanged = (e: any, data: string[]) => {
    setTrainerCreationForm({...tranierCreationForm,categoryIds: [...data]}); 
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
              circular
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


  const getConfirmContent = () => {
                return (
                    <div className="center trainerForm_ConfirmContent" >
                        <p>Girmiş olduğunuz bu bilgiler ile sisteme kayıt olmaktasınız:</p>
                        <Segment>
                         <p><span>Email: </span><span>{tranierCreationForm.email}</span></p>
                         <p><span>Kullanıcı Adı: </span><span>{tranierCreationForm.username}</span></p>
                         <p><span>Ad Soyad: </span><span>{tranierCreationForm.displayname}</span></p>
                         <p><span>Telefon: </span><span>{tranierCreationForm.phone}</span></p>
                         <p><span>Şifre: </span><span>******</span></p>
                         <p><span>Uzmanlık kategorisi: </span>
                         {(tranierCreationForm.categoryIds && tranierCreationForm.categoryIds.map((cat) => (
                            <span key={tranierCreationForm.username+Math.random()+cat} >
                              {categoryOptions.filter(x => x.key === cat)[0].text}</span>
                          )))}</p>
                        </Segment>
                        {/* <p>Ancak Email adresinize gelen mesajdaki link üzerinden hesabınızı onaylamanız durumunda sisteme istediğiniz zaman giriş yapabilir. Formu doldurmaya devam edebilirsiniz.</p> */}
                        <p><a style={{textDecoration:"underline"}}>Bir sonraki adım:</a> Belge yükleme</p>
                        {/* <p>Hesabınız değerlendirildikten ve onay mesajını aldıktan sonra sistemde aktivite açmaya ve profil oluşturmaya başlayabilirsiniz.</p> */}

                    </div>
                )

}


    return (
      <>    
         <Confirm
          content={getConfirmContent()}
          open={userConfirmOpen}
          header="Uzman Kaydı"
          confirmButton="Onayla/Devam et"
          cancelButton="Geri"
          onCancel={() =>setUserConfirmOpen(false)}
          onConfirm={handleSubmitWaitingTrainer}
        />
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          Girmiş olduğunuz bilgileri kontrol ediyoruz.
        </Message.Content>
      </Message>
      </>
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
          if(values.categoryIds.length === 0)
          {
            errors.categoryIds = "Kategori alanı seçimi zorunludur."
          }
          if (!values.username) {
            errors.username = 'Kullanıcı adı zorunlu alan'
          }
          if (!values.displayname) {
            errors.displayname = 'Ad Soyad zorunlu alan'
          }
          if (!values.email) {
            errors.email = 'Email zorunlu alan'
          }

          if(!values.email || !/.+@.+\.[A-Za-z]+$/.test(values.email))
          {
            errors.email = 'Geçersiz email adresi'
          }

          if (!values.phone) {
            errors.phone = 'Telefon zorunlu alan'
          }
          if (!values.password) {
            errors.password = 'Şifre zorunlu alan'
          }
          if (!values.repassword) {
            errors.repassword = 'Şifre tekrarı zorunlu alan'
          }
          if (values.repassword !== values.password) {
            errors.repassword = 'Zorunlu alan';
            errors.password = 'Zorunlu alan';
          }
          if (!values.hasSignedContract) {
            errors.hasSignedContract = 'Zorunlu alan'
          }
         
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
            <label id="categoryLabel">Kategori* </label>
            <Field
                  labelName="categoryLabel"
                  name="categoryIds"
                  placeholder="Kategori"
                  value={tranierCreationForm.categoryIds}
                  component={DropdownMultiple}
                  emptyError={tranierCreationForm.categoryIds}
                  options = {categoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      handleCategoryChanged(e,data)}
                    }
                /> 
           
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
            <Form.Group widths="equal">
            <Field 
            name="email" 
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
              circular
              content="Devam"
              positive
              fluid={isMobile}
              style={{width:"150px"}}
            />
          </div>
          <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY!}
        />
          </Form>
        )}
      />
      </>
       }
    
      </>
    );
}


export default observer(FormPage1)