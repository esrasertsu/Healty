import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Confirm, Form,  Icon, Message } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import { Category, ICategory } from '../../app/models/category';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive'
import NumberInput from '../../app/common/form/NumberInput';
import agent from '../../app/api/agent';
import { action } from 'mobx';
import SubMerchantDetails from '../subMerchant/SubMerchantDetails';
import Documents from '../profiles/Documents';
import { Document, IDocument } from '../../app/models/profile';

interface IProps{
  id:string;
}

const FormPage2: React.FC<IProps> = ({id}) =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering, registerTrainer,tranierCreationForm,
      settrainerRegisteringFalse,user } = rootStore.userStore;
      const{deletingDocument,deleteDocument} = rootStore.profileStore;
    const { cities } = rootStore.commonStore;


   const [docs, setDocs] = useState<any[]>([]);
   const [filedocs, setFileDocs] = useState<any[]>([]);
   const [updateEnabled, setUpdateEnabled] = useState(false);

   const [activeIndex, setActiveIndex] = useState(0);
  const [trainerRegisteredSuccess, setTrainerRegisteredSuccess] = useState(false)
  const {allCategoriesOptionList} = rootStore.categoryStore;
  const {trainerForm, setTrainerForm} = rootStore.userStore;
  const {accessibilities, loadAccessibilities} = rootStore.profileStore;

  let subCategoryOptionFilteredList: ICategory[] = [];

    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();
    const [showM, setShowM] = useState(false);
    const [trainerForm2Message, setTrainerForm2Message] = useState(false);
    const [error2Message, setError2Message] = useState<string[]>([]);
    const [userConfirmOpen, setUserConfirmOpen] = useState(false);
    const [userSubmerchant,setUserSubmerchant] = useState(false);
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
    setTrainerForm(new TrainerFormValues(newTrainer));
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


    const handleCategoryChanged = (e: any, data: string[]) => {
        setTrainerForm({...trainerForm,categoryIds: [...data]});
        setCategoryIds([...data]);
     }
    
     const handleSubCategoryChanged = (e: any, data: string[]) => {  
         setTrainerForm({...trainerForm,subCategoryIds: [...data]});
       }

       const handleAccessChanged = (e: any, data: any) => {  
        setTrainerForm({...trainerForm,accessibilityIds: [...data]});
       }
    
    const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> trainerForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
            subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
        ))
        setSubCategoryOptions(subCategoryOptionFilteredList);
        const renewedSubIds = trainerForm.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
        setTrainerForm({...trainerForm,subCategoryIds: [...renewedSubIds]});
     }

     const handleCityChanged = (e: any, data: string) => {  
            setCityId(data);
            setTrainerForm({...trainerForm,cityId: data});
     }    
    useEffect(() => {
        loadSubCatOptions();
    }, [allCategoriesOptionList,categoryIds]);


    const handleSendToConfirm = (e:any) =>{
       e && e.preventDefault();
       setUserConfirmOpen(true);

    }

    const handleDeleteDocument = (document:IDocument) =>{

      let previewDocs:IDocument[] =[];
      let restUnsaved:File[] =[];


      if(document.id !== "")
      {
        previewDocs = trainerForm.certificates!.filter(x => x.id !== document.id);

        setTrainerForm({...trainerForm,certificates: previewDocs, deletedDocuments: [...trainerForm.deletedDocuments, document.id] });

      }else{
        previewDocs = trainerForm.certificates!.filter(x => x.url !== document.url);
        restUnsaved = trainerForm.newDocuments!.filter(x => x.name !== document.name);

        setTrainerForm({...trainerForm, certificates: previewDocs, newDocuments:restUnsaved});

      }

    }


    useEffect(() => {
      if(docs.length > 0)
      docs.forEach(doc => {
        uploadedNewDoc(doc)
      });
     
      
    }, [docs])


    
  const uploadedNewDoc = (file:any) =>{
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);//original blob data dönüyor

    reader.onloadend = function (e:any) { //okuma işlemi bitince file update ediliyor preview data ile.
        console.log(reader.result)//blob var

        const newDoc = new Document(file);
      //Kaydedilen Dokumanlar Blob olmalı yani File or Blob ama geri gelen data IDocument

        setTrainerForm({...trainerForm,certificates:[...trainerForm.certificates,newDoc], newDocuments:[...trainerForm.newDocuments,file]});
      }; 
  }

    const handleSaveTrainerForm = (e:any,values:ITrainerFormValues) =>{
      setTrainerForm2Message(false);
      debugger;
      e && e.preventDefault();
      

        registerTrainer(values).then((res) => 
        {
          if(res)
            toast.success("Bilgileriniz kaydedildi. En yakın zamanda başvurunuzu bekliyoruz.")
          })
        .catch((error:any) => (
          settrainerRegisteringFalse(),
          setShowM(true),
          toast(error),
          console.log(error)
        ))
    }

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

    if(messages.length > 0){
      setError2Message(messages);
      setTrainerForm2Message(true);
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
        setShowM(true),
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
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Kaydediliyor..</Message.Header>
          Başvuru formunuzu güncelliyoruz.
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
      { trainerForm2Message && <Message
      error
      header=''
      list={error2Message}
    />}
        <FinalForm
        onSubmit={(values: ITrainerFormValues) =>
          handleSaveTrainerForm(null,values)
        }
        initialValues={trainerForm!}
        render={({
          handleSubmit,
          submitting,
          submitError
        }) => (
          <Form className='trainerRegisterForm' onSubmit={handleSubmit} error>
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
                  onChange={(e: any,data:[])=>
                    {
                      handleCategoryChanged(e,data)}}
                /> 
                  <label>Uzman Branşı / Alt Kategorisi*</label>
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  value={trainerForm.subCategoryIds}
                  onChange={(e: any,data:[])=>
                    {
                      handleSubCategoryChanged(e,data)}}
                />  
                 <label>Aradığınız alt kategoriyi bulamadınız mı?</label>
                 <Field
                  name='suggestedSubCategory'
                  component={TextInput}
                  placeholder='Alt kategori / branş ismi'
                  value={trainerForm.suggestedSubCategory}
                />  
                 <OnChange name="suggestedSubCategory">
           {(value, previous) => {
             debugger;
                        if(value !== trainerForm.suggestedSubCategory)
                        {
                            setTrainerForm({...trainerForm,suggestedSubCategory: value});
                        }
                    }}
            </OnChange>
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
                 {
                 <div style={{margin:"10px 0 30px  0"}}>
                 <Documents docs={trainerForm.certificates} setDocuments={setDocs} setFiles={setFileDocs}
                  setUpdateEnabled={setUpdateEnabled} deleteDocument={handleDeleteDocument}/>
                </div>
                 }      
               
               <label>Şehir*</label>
                <Field 
                  name="cityId"
                  placeholder="Şehir"
                  value={trainerForm.cityId}
                  component={DropdownInput}
                  options={cities}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
                <label>Çalıştığınız/Bağlı Olduğunuz Kurum</label>
                <Field name="dependency" placeholder="Şirket Adı / Freelance" component={TextInput} value={trainerForm.dependency}/>
                <OnChange name="dependency">
                    {(value, previous) => {
                     
                        if(value !== trainerForm.dependency)
                        {
                            setTrainerForm({...trainerForm,dependency: value});
                        }
                    }}
                </OnChange>
                <label>Erişilebilirlik*</label>
                <Field
                clearable
                  name="accessibilityIds"
                  placeholder="Erişilebilirlik"
                  value={trainerForm.accessibilityIds}
                  component={DropdownMultiple}
                  options={accessibilities}
                  onChange={(e: any,data:any)=>
                    {
                      handleAccessChanged(e,data)}}
                /> 
                 <label>Tanıtım yazısı</label>
                 <Field
                  name="description"
                  placeholder="Açıklama"
                  component={TextAreaInput}
                  value={trainerForm.description}
                />
                 <OnChange name="description">
                {(value, previous) => {
                    if(value !== trainerForm.description)
                    {
                        setTrainerForm({...trainerForm,description: value});
                    }
                }}
            </OnChange>
            <Button
                  loading={submitting}
                  disabled={submitting }
                  floated="right"
                  className="blueBtn"
                  labelPosition="right"
                  icon="save"
                  circular
                  content="Kaydet"
                  onClick={(e,data)=> {e.preventDefault();handleSaveTrainerForm(e,trainerForm)}}
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
    <SubMerchantDetails id={id} setIsSubMerchant={setUserSubmerchant} />
     
   
      </Accordion.Content>
            </Accordion>
            {submitError && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
               { trainerForm2Message && <Message
      error
      header=''
      list={error2Message}
    />}
            <Button
              loading={submitting}
              content="Başvuruyu Gönder"
              floated="right"
              icon="send"
              className='orangeBtn'
              labelPosition='right'
              circular
              style={{marginTop:"30px"}}
              onClick={(e,data)=>{  e.preventDefault(); handleSendToConfirm(e)}}
            />
          </Form>
        )}
      />
    
      </>
       }
    
      </>
    );
}


export default observer(FormPage2)