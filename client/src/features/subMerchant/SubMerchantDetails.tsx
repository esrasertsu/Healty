import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Label, Header, Image, Icon, Modal } from "semantic-ui-react";
import {
  ISubMerchantInfo,
   SubMerchantInfo
} from "../../app/models/user";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import {combineValidators, composeValidators, createValidator, hasLengthGreaterThan, hasLengthLessThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../app/stores/rootStore";
import { OnChange } from 'react-final-form-listeners';
import { action, values } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import SelectInput from "../../app/common/form/SelectInput";
import PhoneNumberInput from "../../app/common/form/PhoneNumberInput";
import NumberInput from "../../app/common/form/NumberInput";
import IBAN from "iban";



const companyTypeOptions = [
    { key: '0', value: '0', text: 'Bireysel' },
    { key: '1', value: '1', text: 'Şahıs Şirketi' },
    { key: '2', value: '2', text: 'Lmited/Anonim Şirket' },
]

const SubMerchantDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    cities
  } = rootStore.commonStore;

  const {getSubMerchantInfo,setsubMerchantFormValues, subMerchantForm,createSubMerchant,editSubMerchant } = rootStore.userStore;
  const { isLoggedIn } = rootStore.userStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;

  const [IBANValidMessage, setIBANValidMessage] = useState<string>("");
  const [companyTypeErrorMessage,setCompanyTypeErrorMessage]= useState<string>("");
  const [tcknMessage,setTcknMessage]= useState<string>("");
  const [TaxOfficeMessage,setTaxOfficeMessage]= useState<string>("");
  const [TaxNumberMessage,setTaxNumberMessage]= useState<string>("");
  const [legalCompanyTitleMessage,setlegalCompanyTitleMessage]= useState<string>("");
  const [iyzicoContract, setIyzicoContract] = useState(false); 
  const [showIyzicoContract, setShowIyzicoContract] = useState(true);
  const [contractErrorMessage,setContractErrorMessage]= useState("");
  const [loading, setLoading] = useState(false);

  const openIyzicoModal = (e:any) => {
    e.stopPropagation();
    if(modal.open) closeModal();
  
        openModal("Uzman Başvuru Formu", <>
        <Modal.Description>
        <iframe style={{width:"100%", border:"none"}} src="https://www.iyzico.com/pazaryeri-satici-anlasma/" />
        </Modal.Description>
        </>,false,
       "","", false) 
       
  }

  const isValidEmail = createValidator(
    message => value => {
      if (value && !/.+@.+\.[A-Za-z]+$/.test(value)) {
        return message
      }
    },
    'Geçersiz e-posta'
  )

  const isValidIdentityNumber = createValidator(
    message => value => {
      if (subMerchantForm.merchantType ==="0" && value && value.length !== 11) {
        setTcknMessage(message)
      }else{
        setTcknMessage("");
      }
    },
    'Geçersiz TCKN'
  )

  const customTcknIsRequired = subMerchantForm.merchantType !== "2" ? isRequired({message: 'TCKN zorunlu alandır.'}) : 
  isRequired({message:""})

  const customTaxOfficeRequired = subMerchantForm.merchantType !== "0" ? 
  isRequired({message: 'Vergi dairesi zorunlu alandır.'}) : 
  isRequired({message:""})

  const customTaxNumberRequired = subMerchantForm.merchantType === "2" ? 
  isRequired({message: 'Vergi no zorunlu alandır.'}) : 
  isRequired({message:""})

  const customlegalNameRequired = subMerchantForm.merchantType !== "0" ? 
  isRequired({message: 'Yasal şirket adı zorunlu alandır.'}) : 
  isRequired({message:""})
  
  const validate = combineValidators({
    contactName: isRequired({message: 'Ad zorunlu alandır.'}),
    contactSurname: isRequired({message: 'Soyad zorunlu alandır.'}),
    gsmNumber: isRequired({message: 'Telefon numarası zorunlu alandır.'}),
    email: composeValidators(
      isRequired({message: 'Email zorunlu alandır.'}),
      isValidEmail
    )(),
    iban: isRequired({message:'Iban zorunlu alandır.'}),
    identityNumber:composeValidators(
      customTcknIsRequired,
      isValidIdentityNumber
    )(),
    taxOffice:customTaxOfficeRequired,
    taxNumber: customTaxNumberRequired,
    legalCompanyTitle: customlegalNameRequired,
    address: isRequired({message:'Adres zorunlu alandır.'}),
    //contactName: isRequired({message: 'Ad zorunlu alandır.'}),
    // description: composeValidators(
    //   hasLengthGreaterThan(50)({message: 'Açıklama en az 50 karakter uzunluğunda olmalıdır.'})
    // )(),
  })
  useEffect(() => {
    if(isLoggedIn)
     {
      setLoading(true);
      getSubMerchantInfo()
        .then(action((res) => {
            if(res)
            {
              setsubMerchantFormValues(new SubMerchantInfo(res));
              if(res && res.hasSignedContract)
              {
                setShowIyzicoContract(false);
                setIyzicoContract(true);
              }
            }
             
        }))
        .finally(() => setLoading(false));
     } 
    return () => {
        setsubMerchantFormValues(new SubMerchantInfo());
    }
  }, [getSubMerchantInfo,isLoggedIn]);

  const handleFinalFormSubmit = (values: ISubMerchantInfo) => {

    let ok = true;

    if(!iyzicoContract)
    {
      setContractErrorMessage("Sözleşme imzalanması zorunludur");
      ok = false;
    }
    if(!IBAN.isValid(values.iban))
     {
         setIBANValidMessage("IBAN numarası geçersiz");
         ok = false;
     }
    if(values.merchantType === "" || values.merchantType ===null)
    {
      setCompanyTypeErrorMessage("Şirket türü zorunlu alan.");
      ok = false;

    }
    if(values.merchantType === "0")
    {
      if(values.identityNumber ==="" || values.identityNumber === null)
      {
        setTcknMessage("TCKN zorunlu alan.");
        ok = false;
      }
    }else if(values.merchantType === "1")
    {
      if(values.taxOffice ==="" || values.taxOffice === null)
      {
        setTaxOfficeMessage("Vergi dairesi zorunlu alan.");
        ok = false;

      }
      if(values.identityNumber ==="" || values.identityNumber === null)
      {
        setTcknMessage("TCKN zorunlu alan.");
        ok = false;

      }
     
      if(values.legalCompanyTitle ==="" || values.taxOffice === null)
      {
        setlegalCompanyTitleMessage("Yasal şirket ünvanı zorunlu alan.");
        ok = false;

      }

    }else if(values.merchantType ==="2")
    {
      if(values.taxNumber === undefined || values.taxNumber === null || values.taxNumber === 0)
      {
        setTaxNumberMessage("Vergi No zorunlu alan.");
        ok = false;
      }
      if(values.taxOffice ==="" || values.taxOffice === null)
      {
        setTaxOfficeMessage("Vergi dairesi zorunlu alan.");
        ok = false;

      }
      if(values.legalCompanyTitle ==="" || values.taxOffice === null)
      {
        setlegalCompanyTitleMessage("Yasal şirket ünvanı zorunlu alan.");
        ok = false;

      }

    }

      if(ok)
      {
        setLoading(true);
        if (!values.id) {
          let subMerchant = {
            ...values,
            iban:values.iban.trim(),
            id: uuid(),
          };
          createSubMerchant(subMerchant).then((res) =>{
            setLoading(false);
            if(res)
            toast.success("Bilgileriniz başarıyla kaydedilmiştir.");
            else toast.error("Bilgileriniz kaydedilemedi. Sorun devam ederse bize ulaşın.");
  
          })
        } else {
              let editedMerchant = {
                ...values,
                iban:values.iban.trim()
              }
              editSubMerchant(editedMerchant).then((res) =>{
                setLoading(false);

                if(res)
                toast.success("Bilgileriniz başarıyla kaydedilmiştir.");
                else toast.error("Bilgileriniz kaydedilemedi. Sorun devam ederse bize ulaşın.");
      
              });
   
        }
      }else {
        toast.error("Formu gözden geçirin")
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
                <label className="fieldLabel" id="contactNamelabel">Ad*</label>
                <Field
                 labelName="contactNamelabel"
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
                <label className="fieldLabel" id="contactSurNamelabel">Soyad*</label>
                <Field
                labelName="contactSurNamelabel"
                  name="contactSurname"
                  placeholder=""
                  value={subMerchantForm.contactSurname}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="contactSurname">
                {(value, previous) => {
                  previous !=null &&
                        setsubMerchantFormValues({...subMerchantForm,contactSurname: value});
                }}
                </OnChange>
                </Form.Group>

                <Form.Group widths="equal">
                <label className="fieldLabel" id="emaillabel">Email*</label>
                <Field 
                labelName="emaillabel"
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
                <label className="fieldLabel" id="gsmNumber_label">Telefon Numarası*</label>
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
                <label className="fieldLabel" id="companyTypeLabel">Şirket Türü*</label>
                <Field
                  emptyError={subMerchantForm!.merchantType}
                  labelName="companyTypeLabel"
                  name="merchantType"
                  placeholder="Seçiniz"
                  value={subMerchantForm!.merchantType}
                  component={SelectInput}
                  options={companyTypeOptions}

                />
                 {companyTypeErrorMessage!=="" && <label style={{color:"red"}}>{companyTypeErrorMessage}</label>}            
                 <OnChange name="merchantType">
                {(value, previous) => {
                  if(value === "0")
                    { 
                      setTaxNumberMessage("");
                      setTaxOfficeMessage("");
                      setlegalCompanyTitleMessage("");                   
                      setsubMerchantFormValues({...subMerchantForm,merchantType: value, taxOffice:"",taxNumber:null,legalCompanyTitle:""});
                    }                    
                    else if(value === "1")
                    {
                      setTaxNumberMessage("");
                      setsubMerchantFormValues({...subMerchantForm,merchantType: value,taxNumber:null});
                    }
                    else if(value === "2")
                    {
                      setsubMerchantFormValues({...subMerchantForm,merchantType: value, identityNumber:""});
                      setTcknMessage("");
                    }
                    
                  
                  setCompanyTypeErrorMessage("");
                }}
                  </OnChange>
                  {
                    subMerchantForm.merchantType !== "2" ? 
                    <>
                    <label className="fieldLabel" id="tcknLabel">TC Kimlik Numarası*</label>
                    <div className="field" style={{display:"flex", flexDirection:"column"}}>
                    <Field
                      labelName="tcknLabel"
                      name="identityNumber"
                      type="number"
                      placeholder=""
                      value={subMerchantForm.identityNumber}
                      component={TextInput}
                      style={{marginBottom:15}}
                    />
                     {tcknMessage!=="" && <label style={{color:"red"}}>{tcknMessage}</label>}   
                     </div>         
                        <OnChange name="identityNumber">
                    {(value, previous) => {
                            setsubMerchantFormValues({...subMerchantForm,identityNumber: value});
                            setTcknMessage("");
                    }}
                    </OnChange>
                    </>
                    :
                    <>
                <label id="taxNumberLabel" className="fieldLabel">Vergi No*</label>
                <Field
                  labelName="taxNumberLabel"
                  name="taxNumber"
                  type="number"
                  placeholder=""
                  value={subMerchantForm.taxNumber}
                  component={NumberInput}
                  style={{marginBottom:15}}
                />
                 {TaxNumberMessage!=="" && <label style={{color:"red"}}>{TaxNumberMessage}</label>}            
                    <OnChange name="taxNumber">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,taxNumber: value});
                        setTaxNumberMessage("");
                }}
                </OnChange>
                    </> 
                  }
                 
                  </Form.Group>
                 
              {/* <label className="fieldLabel">Şirket Adı*</label>
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
                </OnChange> */}
                {
                    subMerchantForm.merchantType !== "0" &&
                    <>
                <label id="taxOfficeLabel" className="fieldLabel">Vergi Dairesi*</label>
                <Field
                labelName="taxOfficeLabel"
                  name="taxOffice"
                  placeholder=""
                  value={subMerchantForm.taxOffice}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                {TaxOfficeMessage!=="" && <label style={{color:"red"}}>{TaxOfficeMessage}</label>}            
                    <OnChange name="taxOffice">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,taxOffice: value});
                        setTaxOfficeMessage("");
                }}
                </OnChange>
               

                <label id="legalCompanyTitleLabel" className="fieldLabel">Yasal Şirket Ünvanı*</label>
                <Field
                  name="legalCompanyTitle"
                  labelName="legalCompanyTitleLabel"
                  placeholder=""
                  value={subMerchantForm.legalCompanyTitle}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                 {legalCompanyTitleMessage!=="" && <label style={{color:"red"}}>{legalCompanyTitleMessage}</label>}            
                    <OnChange name="legalCompanyTitle">
                {(value, previous) => {
                        setsubMerchantFormValues({...subMerchantForm,legalCompanyTitle: value});
                        setlegalCompanyTitleMessage("");
                }}
                </OnChange>

                </>

}
                <label id="addressLabel" className="fieldLabel">Adres*</label>
                 <Field
                  name="address"
                  labelName="addressLabel"
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
                <label className="fieldLabel" id="ibanlabel">IBAN*</label>
                <Field
                  name="iban"
                  labelName="ibanlabel"
                  placeholder="TR111106200119000006672315"
                  value={subMerchantForm.iban}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                {IBANValidMessage!=="" && <label style={{color:"red"}}>{IBANValidMessage}</label>}            
                    <OnChange name="iban">
                {(value, previous) => {
                        if(value===""){
                          setIBANValidMessage("");
                          setsubMerchantFormValues({...subMerchantForm,iban: value});
                        }else if(IBAN.isValid(value))
                         { 
                           setsubMerchantFormValues({...subMerchantForm,iban: value});
                           setIBANValidMessage("");
                        }else if(!IBAN.isValid(value))
                        {
                          setsubMerchantFormValues({...subMerchantForm,iban: value});
                          setIBANValidMessage("IBAN numarası geçersiz");
                        }

                }}
                </OnChange>
               { showIyzicoContract &&
                    <div style={{margin:"30px 0"}}>
                    <Field
                        name="hasSignedContract"
                        component="input"
                        type="checkbox"
                        initialValue={subMerchantForm.hasSignedContract}
                        width={4}
                        format={v =>v === true}
                        parse={v => (v ? true : false) }
                      />&nbsp;&nbsp;
                      <span><a style={{cursor:"pointer"}} onClick={openIyzicoModal}>iyzico Pazaryeri Satıcı Anlaşma Sözleşmesi</a>'ni onaylıyorum.</span> 
                      {contractErrorMessage!=="" && <label style={{color:"red"}}>{contractErrorMessage}</label>}    
                      <OnChange name="hasSignedContract">
                  {(value, previous) => {
                      setsubMerchantFormValues({...subMerchantForm, hasSignedContract:value});
                      setIyzicoContract(value);

                  }}
                  </OnChange>
                  </div>
               }
                
               
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
