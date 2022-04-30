import React, { Fragment, useContext, useState } from 'react'
import { Segment, Header, Form, Button, Icon, Grid, Message } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { RootStoreContext } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import DropdownInput from '../../../app/common/form/DropdownInput';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { OnChange } from 'react-final-form-listeners';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import PhoneNumberInput from '../../../app/common/form/PhoneNumberInput';
import { IAccountInfoValues } from '../../../app/models/user';
import { ErrorMessage } from '../../../app/common/form/ErrorMessage';


 const ContactSettings: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
    cities
  } = rootStore.commonStore;
  const {
    editContactDetails,accountForm,setAccountForm, submittingContactDetails
  } = rootStore.userStore;

  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const [errorMessage, setErrorMessage]= useState("")  
    const [trainerFormMessage, setTrainerFormMessage]= useState(false)  

  const handleFinalFormSubmit = (values: IAccountInfoValues) => {

    editContactDetails(values)
    
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