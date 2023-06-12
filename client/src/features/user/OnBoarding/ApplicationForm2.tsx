import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Confirm, Form,  Icon, Message } from 'semantic-ui-react';
import DropdownInput from '../../../app/common/form/DropdownInput';
import DropdownMultiple from '../../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../../app/common/form/ErrorMessage';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import TextInput from '../../../app/common/form/TextInput';
import { Category, ICategory } from '../../../app/models/category';
import { ITrainerFormValues, TrainerFormValues } from '../../../app/models/user';
import { useStore } from '../../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import NumberInput from '../../../app/common/form/NumberInput';
import agent from '../../../app/api/agent';
import { action } from 'mobx';
import SubMerchantDetails from '../../subMerchant/SubMerchantDetails';
import Documents from '../../profiles/Documents';
import { Document, IDocument } from '../../../app/models/profile';
import { useMediaQuery } from 'react-responsive';

interface IProps{
   id:string;
   setUserSubmerchant:(sub:boolean)=> void;

}

const ApplicationForm2: React.FC<IProps> = ({id,setUserSubmerchant}) =>{
    const rootStore = useStore();
   
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


    return (
      <>
       <h1 style={{textAlign:"center", marginBottom:"20px"}}>Firma Bilgileri</h1>
     <Message
        className="trainerFormAccordionMessage"
        info
        content={<>
        <li>Bu bölümde gireceğin bilgiler sistem üzerinde kazandığın paranın sana doğru aktarılması ve fatura işlemlerimiz için gerekli bilgilerdir.</li>
        <li>Sistemimize 3 şekilde kayıt olabilirsin: Bireysel, Şahıs Şirketi, Limited veya Anonim Şirket.</li>
        <li>Bireysel kayıt yapan kullanıcılarımız site komisyonuna (bkz:bir sonraki aşamada "Hizmet Sözleşmesi") ek olarak KDV kesintisini de kabul etmiş sayılmaktadır.</li>
        <li>Ödemeler aktivite bitimini takip eden haftanın ortası otomatik olarak IYZICO aracılığı ile gerçekleştirilmektedir, dolayısıyla lütfen doğru bilgileri girdiğinden emin ol.</li>
        <li>Detaylı bilgi ve soruların için: admin@afitapp.com.</li>
        </>}
      />
      <SubMerchantDetails id={id} setIsSubMerchant={setUserSubmerchant} headerHide={true} />
      </>
    );
}


export default observer(ApplicationForm2)