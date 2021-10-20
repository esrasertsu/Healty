import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Label, Header, Image, Icon } from "semantic-ui-react";
import {
  ISubMerchantInfo,
   SubMerchantInfo
} from "../../app/models/user";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import {combineValidators, composeValidators, hasLengthGreaterThan, hasLengthLessThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../app/stores/rootStore";
import { OnChange } from 'react-final-form-listeners';
import { action } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import SelectInput from "../../app/common/form/SelectInput";
import PhoneNumberInput from "../../app/common/form/PhoneNumberInput";
import NumberInput from "../../app/common/form/NumberInput";
import IBAN from "iban";
const validate = combineValidators({
  contactName: isRequired({message: 'Ad zorunlu alandır.'}),
  contactSurname: isRequired({message: 'Ad zorunlu alandır.'}),
  gsmNumber: isRequired({message: 'Telefon zorunlu alandır.'}),
  email: isRequired({message: 'Email zorunlu alandır.'}),
  iban: isRequired({message:""})
  // description: composeValidators(
  //   hasLengthGreaterThan(50)({message: 'Açıklama en az 50 karakter uzunluğunda olmalıdır.'})
  // )(),
})

const companyTypeOptions = [
    { key: '0', value: '0', text: 'Şahıs Şirketi' },
    { key: '1', value: '1', text: 'Anonim Şirket' },
    { key: '2', value: '2', text: 'Limited Şirket' },
]

const SubMerchantDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    cities
  } = rootStore.commonStore;

  const {getSubMerchantInfo,setsubMerchantFormValues, subMerchantForm,createSubMerchant,editSubMerchant } = rootStore.userStore;


  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);
  const [IBANValidMessage, setIBANValidMessage] = useState<string>("");

  
  const [loading, setLoading] = useState(false);

  


  useEffect(() => {
      setLoading(true);
      getSubMerchantInfo()
        .then(action((res) => {
          debugger;
            if(res)
            setsubMerchantFormValues(new SubMerchantInfo(res));
        }))
        .finally(() => setLoading(false));
    

    return () => {
        setsubMerchantFormValues(new SubMerchantInfo());
    }
  }, [getSubMerchantInfo]);



  const handleFinalFormSubmit = (values: ISubMerchantInfo) => {

    if(!IBAN.isValid(values.iban))
       setIBANValidMessage("IBAN numarası geçersiz");
    else{

      if (!values.id) {
        let subMerchant = {
          ...values,
          iban:values.iban.trim(),
          id: uuid(),
        };
        createSubMerchant(subMerchant).then((res) =>{
          if(res)
          toast.success("Bilgileriniz başarıyla kaydedilmiştir.");
          else toast.error("Bilgileriniz kaydedilemedi. Sorun devam ederse bize ulaşın.");

        })
      } else {
        debugger;
            let editedMerchant = {
              ...values,
              iban:values.iban.trim()
            }
            editSubMerchant(editedMerchant).then((res) =>{
              if(res)
              toast.success("Bilgileriniz başarıyla kaydedilmiştir.");
              else toast.error("Bilgileriniz kaydedilemedi. Sorun devam ederse bize ulaşın.");
    
            });
 
      }
    }
    
  };

  return (
    <Grid stackable>
      <Grid.Row>
      <Grid.Column>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={subMerchantForm}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading} className="companyFinalForm"
              >
                
                <Form.Group widths="equal">
                <label>Ad*</label>
                <Field
                  name="contactName"
                  placeholder=""
                  value={subMerchantForm.contactName}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="contactName">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,contactName: value});
                }}
                </OnChange>
                <label>Soyad*</label>
                <Field
                  name="contactSurname"
                  placeholder=""
                  value={subMerchantForm.contactSurname}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="contactSurname">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,contactSurname: value});
                }}
                </OnChange>
                </Form.Group>

                <Form.Group widths="equal">
                <label>Email*</label>
                <Field 
                type="email" 
                name="email" 
                placeholder=""
                value={subMerchantForm.email} 
                component={TextInput}/>
                    <OnChange name="email">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,email: value});
                }}
                </OnChange>
                <label id="gsmNumber_label">Telefon Numarası*</label>
                <Field
                  name="gsmNumber"
                  labelName="gsmNumber_label"
                  placeholder="Telefon Numarası"
                  component={PhoneNumberInput}
                  value={subMerchantForm.gsmNumber}
                /> 
                <OnChange name="gsmNumber">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                       debugger;
                       setsubMerchantFormValues({...subMerchantForm,gsmNumber: value});
                      
                }}
                </OnChange>
                </Form.Group>
                <Form.Group  widths="equal">
                <label id="companyTypeLabel">Şirket Türü*</label>
                <Field
                  name="merchantType"
                  placeholder="Seçiniz"
                  value={subMerchantForm!.merchantType}
                  component={SelectInput}
                  options={companyTypeOptions}

                />
                 <OnChange name="merchantType">
                {(value, previous) => {
                    if(value !== subMerchantForm.merchantType)
                    {
                        setsubMerchantFormValues({...subMerchantForm,merchantType: value});
                    }
                }}
                  </OnChange>
                  {
                    subMerchantForm.merchantType === "0" ? 
                    <>
                    <label>TC Kimlik Numarası*</label>
                    <Field
                      name="identityNumber"
                      type="number"
                      placeholder=""
                      value={subMerchantForm.identityNumber}
                      component={TextInput}
                      style={{marginBottom:15}}
                    />
                        <OnChange name="taxNumber">
                    {(value, previous) => {
                            setsubMerchantFormValues({...subMerchantForm,identityNumber: value});
                    }}
                    </OnChange>
                    </>
                    :
                    <>
                <label>Vergi No*</label>
                <Field
                  name="taxNumber"
                  type="number"
                  placeholder=""
                  value={subMerchantForm.taxNumber}
                  component={NumberInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="taxNumber">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,taxNumber: value});
                }}
                </OnChange>
                    </>
                  }
                 
                  </Form.Group>
                 
              <label>Şirket Adı*</label>
             <Field 
                  name="name"
                  placeholder=""
                  component={TextInput}
                  value={subMerchantForm.name}
                  width={16}
                />
                 <OnChange name="name">
                {(value, previous) => {
                    if(value !== subMerchantForm.name)
                    {
                        setsubMerchantFormValues({...subMerchantForm,name: value});
                    }
                }}
                </OnChange>
                {
                    subMerchantForm.merchantType !== "0" &&
                    <>
                <label>Vergi Dairesi*</label>
                <Field
                  name="taxOffice"
                  placeholder=""
                  value={subMerchantForm.taxOffice}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="taxOffice">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,taxOffice: value});
                }}
                </OnChange>
               

                <label>Yasal Şirket Ünvanı*</label>
                <Field
                  name="legalCompanyTitle"
                  placeholder=""
                  value={subMerchantForm.legalCompanyTitle}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="legalCompanyTitle">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,legalCompanyTitle: value});
                }}
                </OnChange>

                </>

}
                <label>Adres*</label>
                 <Field
                  name="address"
                  placeholder="Açık adres"
                  value={subMerchantForm.address}
                  component={TextAreaInput}
                  rows={2}
                />
                <OnChange name="address">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,address: value});
                }}
                </OnChange>
                <label id="ibanlabel">IBAN*</label>
                <Field
                  name="iban"
                  labelName="ibanlabel"
                  placeholder="TR180006200119000006672315"
                  value={subMerchantForm.iban}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                {IBANValidMessage!=="" && <label style={{color:"red"}}>{IBANValidMessage}</label>}            
                    <OnChange name="iban">
                {(value, previous) => {
                        if(IBAN.isValid(value))
                         { 
                           setsubMerchantFormValues({...subMerchantForm,iban: value});
                           setIBANValidMessage("");
                          }

                }}
                </OnChange>
               
                <Button
                  loading={loading}
                  disabled={loading || invalid }
                  floated="right"
                  positive
                  type="submit"
                  content="Kaydet"
                />
                {/* <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="İptal"
                  onClick={
                    activityForm.id
                      ? () => history.push(`/activities/${activityForm.id}`)
                      : () => history.push("/activities")
                  }
                /> */}
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
     
       </Grid.Row>
    
    </Grid>
  );
};

export default observer(SubMerchantDetails);
