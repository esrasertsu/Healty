import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Checkbox, Confirm, Form,  Icon, Message, Modal } from 'semantic-ui-react';
import { ITrainerFormValues, TrainerFormValues } from '../../../app/models/user';
import { useStore } from '../../../app/stores/rootStore';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import DOMPurify from 'dompurify';

interface IProps{
   userSubmerchant:boolean;
   setTrainerForm2Message:(error:boolean) => void;
   setError2Message:(error:string[]) => void;
    docs:any[];
    setTrainerRegisteredSuccess:(error:boolean) => void;
    userSubMerchant:boolean;

}

const ApplicationForm3: React.FC<IProps> = ({userSubmerchant,setTrainerForm2Message,setError2Message,docs,setTrainerRegisteredSuccess}) =>{
    const rootStore = useStore();
    const {trainerForm, settrainerRegisteringFalse,registerTrainer} = rootStore.userStore;
    const {loadContract,contract} = rootStore.contractStore;
    const sanitizer = DOMPurify.sanitize;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const [userConfirmOpen, setUserConfirmOpen] = useState(false);
    const [signedContract, setsignedContract] = useState(false);



    const handleSubmitTrainerForm = (values:ITrainerFormValues) =>{
        setUserConfirmOpen(false);
    
        const messages = [];
        if(values.categoryIds.length === 0)
        {
          messages.push("Kategori alanı seçimi zorunludur.");
        }
         if(values.subCategoryIds.length === 0 && (values.suggestedSubCategory === "" || values.suggestedSubCategory === null)){
          messages.push("Branş / Alt kategori seçimi zorunludur.");
        }
         if(docs.length === 0 ){
           if(trainerForm.certificates.length === 0)
          messages.push("Belge yüklemek zorunludur.")
    
        }
         if(values.cityId === ""){
          messages.push("Şehir seçimi zorunludur.")
        }
         if(values.title === ""){
          messages.push("Unvan alanı zorunludur.")
    
        }
         if(values.accessibilityIds.length === 0){
          messages.push("Erişilebilirlik seçimi zorunludur.")
        }
         if(values.experienceYear.toString() === ""){
           messages.push("Tecrübe yılı zorunludur.")
    
        }
    
        if(userSubmerchant === false)
        {
          messages.push("Alt üye iş yeri bilgilerinizi lütfen kaydedin.")
        }
        if(signedContract === false)
         messages.push("Lütfen hizmet sözleşmesini okuyup onaylayın.")
      
         if(messages.length > 0){
          setError2Message(messages);
          setTrainerForm2Message(true);
          document.querySelector('body')!.scrollTo({
            top:100,
            behavior: 'smooth'
          })
        }
        else { 
          
          let edittedValues = {
          ...values,
          sendToRegister:true,
          documents: docs,
        }
          registerTrainer(edittedValues).then((res) => 
          {
            if(res)
              setTrainerRegisteredSuccess(true);
    
          })
          .catch((error:any) => (
            settrainerRegisteringFalse(),
            toast(error),
            console.log(error)
          ))
    
        }
       }

      
       

    return (
      <>
       <Confirm
          content={"Başvurunuzu değerlendirilmek üzere göndermeyi onaylıyor musunuz?"}
          open={userConfirmOpen}
          header="Uzman Kaydı"
          confirmButton="Onayla/Devam et"
          cancelButton="Geri"
          onCancel={() =>setUserConfirmOpen(false)}
          onConfirm={(e) => handleSubmitTrainerForm(trainerForm)}
        />
       <h1 style={{textAlign:"center", marginBottom:"20px"}}>Sözleşme Onay ve Başvuru Gönder</h1>

         <div style={{margin:"30px 0"}}>
            <Checkbox 
            name='serviceContract'
            checked={signedContract}
            onChange={(e,data) => setsignedContract(data.checked!)}
        />
       <span><a style={{cursor:"pointer", marginLeft:"10px"}} target="_blank" href="/pdf/Is_Ortakligi_Hizmet_ve_Ilan_Sozlesmesi.pdf" >İş Ortaklığı Hizmet ve İlan Sözleşmesi</a>'ni okudum.</span>
        </div>


        <div style={{textAlign:"center"}}>
        <Button size="big" circular onClick={() => setUserConfirmOpen(true)} color="blue">Başvurumu Gönder</Button>

        </div>
      
                  
                  
      </>
    );
}


export default observer(ApplicationForm3)
