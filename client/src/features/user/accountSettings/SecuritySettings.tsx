import React, { Fragment, useContext, useState } from 'react'
import { Segment, Header, Form, Button, Grid, Message } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { RootStoreContext } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { OnChange } from 'react-final-form-listeners';
import { IAccountInfoValues } from '../../../app/models/user';
import { ErrorMessage } from '../../../app/common/form/ErrorMessage';
import { toast } from 'react-toastify';


 const SecuritySettings: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
    cities
  } = rootStore.commonStore;
  const {
    refreshPassword,accountForm,setAccountForm, submittingPassword} = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [passwordErrorMessage, setPasswordErrorMessage]= useState("")  
    const [errorMessage, setErrorMessage]= useState("")  
    const [trainerFormMessage, setTrainerFormMessage]= useState(false)  


  const handleFinalFormSubmit = (values: IAccountInfoValues) => {

    refreshPassword(values.password).then((res) =>{
      if(res)
       toast.success("Şifre başarıyla değiştirildi")
    })
    
  }
  if(submittingPassword) return <LoadingComponent content='Güncelleniyor...'/>  

    return (
    <Fragment> 
       <Header icon='key' content='Şifre Değişikliği' />
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
      initialValues={accountForm!}
      render={({ handleSubmit, submitting, submitError,
        invalid,
        dirtySinceLastSubmit,pristine }) => (
        <Form onSubmit={handleSubmit} error>
            <Form.Group widths="equal">
            <Field
              label="Şifre*"
              name="password"
              labelName="passwordLabel"
              placeholder="*********"
              type="password"
              component={TextInput}
              value={accountForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                   if(value !== accountForm.password)
                   {
                    setAccountForm({...accountForm,password: value});
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

                      if(value !== accountForm.repassword && accountForm.repassword !="")
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
              value={accountForm.repassword}
            />
            <OnChange name="repassword">
                {(value, previous) => {
                  if(value !== accountForm.repassword)
                  {
                    setAccountForm({...accountForm,repassword: value});
                  }
                    if(value !== accountForm.password && accountForm.password !="")
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
        
          <Button 
            loading={submitting|| submittingPassword}
            disabled={(invalid && !dirtySinceLastSubmit) || submittingPassword}
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

export default observer(SecuritySettings);