import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Confirm, Form,  Icon, List, Message,Segment, Tab } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import FileUploadDropzone from '../../app/common/util/FileUploadDropzone';
import { Category, ICategory } from '../../app/models/category';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive'
import NumberInput from '../../app/common/form/NumberInput';
import agent from '../../app/api/agent';
import { action } from 'mobx';
import IBAN from 'iban';
import SubMerchantDetails from '../subMerchant/SubMerchantDetails';

interface IProps{
  id:string;
}

const ReadyOnlyApplication: React.FC<IProps> = ({id}) =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering, registerTrainer,tranierCreationForm,
      settrainerRegisteringFalse,user } = rootStore.userStore;
      const{deletingDocument,deleteDocument} = rootStore.profileStore;
    const { cities } = rootStore.commonStore;



   const [activeIndex, setActiveIndex] = useState(0);
  const {allCategoriesOptionList} = rootStore.categoryStore;
  const {trainerForm, setTrainerForm} = rootStore.userStore;
  const {accessibilities, loadAccessibilities} = rootStore.profileStore;

  let subCategoryOptionFilteredList: ICategory[] = [];

    const [category, setCategory] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);


    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    
    
useEffect(() => {
  allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
    setCategoryOptions(categoryOptions => [...categoryOptions, new Category({key: option.key, value: option.value, text: option.text})])
));
}, [allCategoriesOptionList])

  
useEffect(() => {

  agent.User.loadNewTrainer(id)
  .then(action((newTrainer) =>
  {
    setTrainerForm(new TrainerFormValues(newTrainer!));
  })).catch((error) => 
     console.log(error)
      
  )  
   loadAccessibilities();
}, [id])

     const handleAccordionClick = (e:any, titleProps:any) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index

        setActiveIndex(newIndex);
      }

    const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> trainerForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
            subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
        ))
        setSubCategoryOptions(subCategoryOptionFilteredList);
        const renewedSubIds = subCat.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
        setSubCats(renewedSubIds);
     }
   
    useEffect(() => {
        loadSubCatOptions();
    }, [category,allCategoriesOptionList]);



    return (
      <>
     
     
      
   
          <Form error>
           
           {/* <Label content="<< Geri" color="orange" onClick={handlePreviousButtonClick} style={{cursor:"pointer", marginBottom:"20px"}}/> */}
           <Accordion fluid styled>
           <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordionClick}
          className="trainerFormAccordionTitle"
        >
          <Icon name='dropdown' />
         Mesleki Bilgiler
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0} style={{marginBottom:"32px"}}>
        <Message
        className="trainerFormAccordionMessage"
        info
        content={<>
        <li>Bu bölümde gireceğiniz bilgiler tamamen uzmanlık alanınızla ilgilidir.</li>
        <li>Girmiş olduğunuz bilgiler kontrol edildikten sonra uzman profiliniz otomatik oluşturulacaktır.</li>
        <li>Onay aşamasından sonra listelerde görünebilir ve aktivite açmaya başlayabilirsiniz.</li>
        <li>Onay mesajını alana kadar (ya da profiliniz uzman profiline dönüşene kadar) bu formu istediğiniz kadar güncelleyebilirsiniz.</li>
        </>}
      />
            <label>Uzman Kategorisi*</label>
            <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  component={DropdownMultiple}
                  options = {categoryOptions}
                  value={trainerForm.categoryIds}
                /> 
                  <label>Uzman Branşı / Alt Kategorisi*</label>
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  value={trainerForm.subCategoryIds}
                />  
                 <label>Ünvan*</label>
          <Field
            name='title'
            component={TextInput}
            placeholder='Örn: Kişisel Gelişim Uzmanı / Personal Trainer / Pedagog'
            value={trainerForm.title}
          />
           <OnChange name="title">
           {(value, previous) => {
                        if(value !== trainerForm.title)
                        {
                            setTrainerForm({...trainerForm,title: value});
                        }
                    }}
            </OnChange>
            <label>Tecrübe (Yıl)*</label>
           <Field 
                  width={2}
                  name="experienceYear"
                  type="number"
                  placeholder="Tecrübe (Yıl)"
                  component={NumberInput}
                  value={trainerForm.experienceYear}
                />
                 <OnChange name="experienceYear">
                 {(value, previous) => {
                   if(value==="")
                     value=0;
                        setTrainerForm({...trainerForm,experienceYear: value});
                    
                }}
            </OnChange>

                 <label>Yeterlilik Belgesi (Diploma/Sertifika)*</label>
                 {trainerForm.certificates && trainerForm.certificates.length !== 0 &&
                 <Segment>
                 <List>
                  {trainerForm.certificates.map((f, index)=> 
                    <List.Item key={"cert_"+index} style={{display:"flex"}}>
                    <List.Icon name='file' />
                    <List.Content style={{display:"flex"}}>
                      <List.Header as='a'>{f.name}</List.Header> 
                    </List.Content>
                  </List.Item>
                  )}
                 </List>
                 </Segment>
                 }      
               <label>Şehir*</label>
                <Field 
                  name="cityId"
                  placeholder="Şehir"
                  value={trainerForm.cityId}
                  component={DropdownInput}
                  options={cities}
                  style={{marginBottom:15}}
                />
                <label>Çalıştığınız/Bağlı Olduğunuz Kurum</label>
                <Field name="dependency" placeholder="Şirket Adı / Freelance" component={TextInput} value={trainerForm.dependency}/>
                
                <label>Erişilebilirlik*</label>
                <Field
                clearable
                  name="accessibilityIds"
                  placeholder="Erişilebilirlik"
                  value={trainerForm.accessibilityIds}
                  component={DropdownMultiple}
                  options={accessibilities}
                
                /> 
                 <label>Tanıtım yazısı</label>
                 <Field
                  name="description"
                  placeholder="Açıklama"
                  component={TextAreaInput}
                  value={trainerForm.description}
                />
               
            </Accordion.Content>

            <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleAccordionClick}
          className="trainerFormAccordionTitle"
        >
          <Icon name='dropdown' />
         Banka Hesabı / Ödeme Bilgileri
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        <Message
        className="trainerFormAccordionMessage"
        info
        content={<>
        <li>Bu bölümde gireceğiniz bilgiler sistem üzerinde kazandığınız paranın size aktarılması ve fatura işlemleri için gerekli bilgilerdir.</li>
        <li>Ödemeler otomatik gerçekleştirilmektedir, dolayısıyla lütfen doğru bilgileri girdiğinizden emin olun.</li>
        <li>Detaylı bilgi, her türlü soru ve istekleriniz için: admin@afitapp.com hesabına mail atabilirsiniz.</li>
        </>}
      />
             
      {/* <Tab className="trainerFormAccountingTab" style={{margin:"20px 0"}} menu={{ pointing: true }} panes={panes} /> */}
       <SubMerchantDetails id={id} />
     
   
      </Accordion.Content>
            </Accordion>
          </Form>
     
      
    
      
    
      </>
    );
}


export default observer(ReadyOnlyApplication)