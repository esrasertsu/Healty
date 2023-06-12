import React, { Fragment, useContext, useState } from 'react'
import { Segment, Header, Form, Button, Icon, Grid, Message, Modal, Image } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { useStore } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import DropdownInput from '../../../app/common/form/DropdownInput';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { OnChange } from 'react-final-form-listeners';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import PhoneNumberInput from '../../../app/common/form/PhoneNumberInput';
import { IAccountInfoValues } from '../../../app/models/user';
import { ErrorMessage } from '../../../app/common/form/ErrorMessage';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import agent from '../../../app/api/agent';
import { toast } from 'react-toastify';


 const ContactSettings: React.FC = () => {

  const rootStore = useStore();
  const {
    cities
  } = rootStore.commonStore;
  const {
    editContactDetails,accountForm,setAccountForm, submittingContactDetails
  } = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const [errorMessage, setErrorMessage]= useState("")  
    const [trainerFormMessage, setTrainerFormMessage]= useState(false)  

    const [otpInput, setOtpInput] = useState("")
    const [optInputDisabled, setoptInputDisabled] = useState(false)
    const [countDownDate, setCountDownDate]= useState(Date.now() +180000);
    const [showPasswordModal, setshowPasswordModal] = useState(false)
    const {closeModal,modal} = rootStore.modalStore;

  const handleFinalFormSubmit = (values: IAccountInfoValues) => {

    
    editContactDetails(values).then((res) =>{
      if(res)
       toast.success("Bilgileriz başarıyla kaydedildi")
    })
    
  }


  
  const renderer = ({ days,hours, minutes, seconds, completed }: any) => {
    if (completed || (seconds===0 && minutes ===0)) {
           setoptInputDisabled(true);

            return (
            <a style={{cursor:"pointer", textDecoration:"underline"}} 
            onClick={()=>agent.User.sendSms(accountForm.phoneNumber as string)}>Doğrulama Kodunu Tekrar Gönder
            </a>
            )

    } else {
      return (
      <>
        <span style={{marginRight:"10px", color:"#429dad"}}>Kalan süre</span>
        <span style={{color:"#429dad"}}>{minutes + ":" + seconds}</span>   
        
       </>
       );
    }

   }

   
   const handleSubmitOtpCode = () =>{
    agent.User.sendSmsVerification(accountForm.phoneNumber!,otpInput).then((res) => {

     if(res){
       if(modal.open) closeModal();
       setshowPasswordModal(false);
       setOtpInput("");
       setoptInputDisabled(false);
       setCountDownDate(Date.now());
       toast.error("Telefon no değiştirme başarılı.")
     }else{
       toast.error("Yanlış kod gönderdiniz. Lütfen tekrar deneyin.")
     }
     }).catch((error) => toast.error(error));
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

 

  const handleCityChanged = (e: any, data: string) => {  
    setAccountForm({...accountForm,cityId: data});
    
 }

 if(submittingContactDetails) return <LoadingComponent content='Güncelleniyor...'/>  


    return (
    <Fragment> 
         <Header icon='address book outline' content='İletişim Bilgileri' />
     <Grid stackable style={{marginBottom:"50px"}}>
     
      <Grid.Row>
      <Grid.Column width={!isTablet ? 12 : 11}>
        <Segment clearing>
        { trainerFormMessage && <Message
      error
      header=''
      content={errorMessage}
    />}
        <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={values => {
        const errors:any = {};

       
        if (!values.name) {
            errors.name = 'Ad zorunlu alan'
          }
          if (!values.surname) {
            errors.surname = 'Soyad zorunlu alan'
          }

        if (!values.phoneNumber) {
          errors.phoneNumber = 'Telefon zorunlu alan'
        }

        return errors
      }}
      initialValues={accountForm!}
      render={({ handleSubmit, submitting, submitError,
        invalid,
        dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
            
<Form.Group widths="equal">
             <Field
            label="Ad*"
            labelName="nameLabel"
            name='name'
            component={TextInput}
            placeholder='İsim'
            value={accountForm!.name}
          />
           <OnChange name="name">
                {(value, previous) => {
                    
                    setAccountForm({...accountForm,name: value});
                }}
            </OnChange>
          <Field
            label="Soyad*"
            labelName="surnameLabel"
            name='surname'
            component={TextInput}
            placeholder='Soyad'
            value={accountForm!.surname}
          />
           <OnChange name="surname">
                {(value, previous) => {
                    
                    setAccountForm({...accountForm,surname: value});
                }}
            </OnChange>

            </Form.Group>            
            <Field
              width={!isTablet ? 6 : 16}
              name="phoneNumber"
              label="Telefon Numarası*"
              labelName="phoneLabel"
              placeholder="Telefon"
              component={PhoneNumberInput}
              value={accountForm.phoneNumber}
            //  onchange={handlePhoneNumberChange}
            />
              <OnChange name="phone">
                {(value, previous) => {
                   if(value !== accountForm.phoneNumber)
                   {
                      setAccountForm({...accountForm,phoneNumber: value});
                   }
                }}
            </OnChange>
           
          <Field
            label="Adres"
            name='address'
            component={TextAreaInput}
            rows={2}
            placeholder='Adres'
            value={accountForm!.address}
          />
           <OnChange name="address">
                {(value, previous) => {
                    setAccountForm({...accountForm,address: value});
                }}
            </OnChange>
          
                <Field 
                label="Şehir"
                  name="cityId"
                  placeholder="Şehir"
                  component={DropdownInput}
                  options={cities}
                  value={accountForm!.cityId}
                  labelName="citylabel"
                  emptyError={accountForm.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                />
                {submitError &&  !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
        
          <Button 
             loading={submitting || submittingContactDetails}
             disabled={submitting || invalid || submittingContactDetails}
            floated='right'
            positive
            circular
            content='Güncelle'
          />
        </Form>
      )}
    />
        </Segment>
      </Grid.Column>
       </Grid.Row>
      
    </Grid>
   </Fragment>
    )
}

export default observer(ContactSettings);