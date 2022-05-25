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
import { RootStoreContext } from '../../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import NumberInput from '../../../app/common/form/NumberInput';
import agent from '../../../app/api/agent';
import { action } from 'mobx';
import SubMerchantDetails from '../../subMerchant/SubMerchantDetails';
import Documents from '../../profiles/Documents';
import { Document, IDocument } from '../../../app/models/profile';
import { useMediaQuery } from 'react-responsive';
import "./styles.scss"
interface IProps{
    trainerForm:ITrainerFormValues;
    setTrainerForm: (form: ITrainerFormValues) => void;
    setTrainerRegisteredSuccess:(status: boolean) => void;
    setActiveTab:(tab:number) => void;
    setTrainerForm2Message:(error:boolean) => void;
    setDocs:(docs:any[]) => void;
    docs:any[];
}

const ApplicationForm1: React.FC<IProps> = ({trainerForm,setTrainerForm,setActiveTab,setTrainerForm2Message,setDocs, docs}) =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering, registerTrainer,tranierCreationForm,
      settrainerRegisteringFalse,user } = rootStore.userStore;
      const{deletingDocument,deleteDocument} = rootStore.profileStore;
    const { cities } = rootStore.commonStore;

   const [filedocs, setFileDocs] = useState<any[]>([]);
   const [updateEnabled, setUpdateEnabled] = useState(false);

  const {allCategoriesOptionList} = rootStore.categoryStore;
  const {accessibilities, loadAccessibilities} = rootStore.profileStore;


    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();
    const [showM, setShowM] = useState(false);

    const [messageVisibility, setmessageVisibility] = useState(true);

    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    let subCategoryOptionFilteredList: ICategory[] = [];

  
     const handleCityChanged = (e: any, data: string) => {  
            setCityId(data);
            setTrainerForm({...trainerForm,cityId: data});
     }    

     allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
        categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
      ));

     const loadSubCatOptions = () =>{
      allCategoriesOptionList.filter(x=> trainerForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      const renewedSubIds = trainerForm.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setTrainerForm({...trainerForm,subCategoryIds: [...renewedSubIds]});

   }
        useEffect(() => {
            loadSubCatOptions();
        }, [categoryIds,allCategoriesOptionList]);
      


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

    const handleCategoryChanged = (e: any, data: string[]) => {
        setTrainerForm({...trainerForm, categoryIds: [...data]});
        setCategoryIds(data);  
      
     }
    
     const handleSubCategoryChanged = (e: any, data: string[]) => {  
         setTrainerForm({...trainerForm,subCategoryIds: [...data]});
       }
    
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
      e && e.preventDefault();
      

        registerTrainer(values).then((res) => 
        {
          if(res)
            setActiveTab(2);
            toast.success("Uzmanlık bilgileriniz kaydedildi.")
          })
        .catch((error:any) => (
          settrainerRegisteringFalse(),
          setShowM(true),
          toast(error),
          console.log(error)
        ))
    }
    const handleAccessChanged = (e: any, data: any) => {  
        setTrainerForm({...trainerForm,accessibilityIds: [...data]});
       }

    const setMessageVisibilty = () =>{
        setmessageVisibility(!messageVisibility);
    }


    return (
      <>
    <h1 style={{textAlign:"center", marginBottom:"20px"}}>Uzmanlık Bilgileri</h1>
    <Message
        className={messageVisibility ? "trainerFormAccordionMessage": "toggle trainerFormAccordionMessage"}
        info
        content={<>
      {  messageVisibility ?
         <>
            <Icon style={{float:"right", cursor:"pointer", fontSize:"25px"}} name="toggle up" onClick={setMessageVisibilty}/>
            <ul style={{marginTop:"10px"}}>
                <li>Merhaba hoşgeldin!</li>
                <li>Bu bölümde gireceğin bilgiler profilini oluşturmak istediğin uzmanlık alanınla ilgilidir.</li>
                <li>Aradığın kategori veya alt kategori (branş) listede gelmiyor ise "Yeni Kategori/Branş Taleplerin" altında dilediğin kadar talep iletebilirsin.</li>
                <li>Seçmiş olduğun kategori(ler) ve branş(lar) için <b>uzmanlığını gösteren belgeleri</b> iletmek zorunludur. Aksi halde başvurun onaylanmayacaktır.</li>
                <li>Uzman Başvuru Formu'nu kaydedip daha sonra doldurmaya devam edebilmek için e-mail adresine gelmiş olan <b>Hesap Doğrulma</b> linki üzerinden hesabını aktive etmeyi unutmamalısın.</li>
                <li>Girmiş olduğun bilgiler kontrol edildikten sonra uzman profilin 24 saat içinde aktive olacaktır. Kontrol etmek için daha önceki aşamada belirlemiş olduğun şifre , e-mail adresi ya da kullanıcı adı ile sisteme giriş yapabilirsin.</li>
                <li>Hesabın <b>Uzman</b> statüsüne çekildikten sonra listelerde görünebilir ve <b>Profilim</b> sayfası üzerinden aktivite açmaya, blog yazmaya başlayabilirsin.</li>
                <li>Onay mesajını alana kadar (profiliniz uzman profiline dönüşene kadar) bu formu istediğin kadar güncelleyebilirsin.</li>
                <li>Detaylı bilgi ve sorular için: <b>admin@afitapp.com</b> </li>
            </ul>
        </>
        :
        <>
         <Icon style={{float:"right", cursor:"pointer", fontSize:"25px"}} name="toggle down" onClick={setMessageVisibilty}/>
         <span>Açıklamayı görmelisin</span>
        </>
        }
        </>}
      />
      {
      <>
    
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
                 <label>Yeni Kategori/Branş Taleplerin (Aradığın alt kategoriyi bulamadın mı?)</label>
                 <Field
                  name='suggestedSubCategory'
                  component={TextInput}
                  placeholder='Alt kategori / branş ismi'
                  value={trainerForm.suggestedSubCategory}
                />  
                 <OnChange name="suggestedSubCategory">
           {(value, previous) => {
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
                  setUpdateEnabled={setUpdateEnabled} deleteDocument={handleDeleteDocument} columnCount={3}/>
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


            {submitError && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
           
            
          </Form>
        )}
      />
    
      </>
       }
    
      </>
    );
}


export default observer(ApplicationForm1)