import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, createValidator, isRequired } from 'revalidate';
import { Accordion, Button, Form, Grid, Header, Icon, Image, Label, List, Message, Modal, Placeholder, Segment } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper';
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone';
import FileUploadDropzone from '../../app/common/util/FileUploadDropzone';
import { Category, ICategory } from '../../app/models/category';
import { ITrainerFormValues, TrainerFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive'
import FormPage1 from './FormPage1';
import NumberInput from '../../app/common/form/NumberInput';
import { history } from '../..';
import agent from '../../app/api/agent';
import { action } from 'mobx';
import IBAN from 'iban';

interface IProps{
  id:string;
}

const FormPage2: React.FC<IProps> = ({id}) =>{
    const rootStore = useContext(RootStoreContext);
    const { trainerRegistering,trainerRegisteredSuccess, registerTrainer,tranierCreationForm,
      settrainerRegisteringFalse } = rootStore.userStore;
    const { cities } = rootStore.commonStore;


   const [docs, setDocs] = useState<any[]>([]);
   const [filedocs, setFileDocs] = useState<any[]>([]);
   const [updateEnabled, setUpdateEnabled] = useState(false);

   const [activeIndex, setActiveIndex] = useState(0);
    
  const {allCategoriesOptionList} = rootStore.categoryStore;
  const {trainerForm, setTrainerForm} = rootStore.userStore;
  const {accessibilities, loadAccessibilities} = rootStore.profileStore;

  let subCategoryOptionFilteredList: ICategory[] = [];

    const [category, setCategory] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();
    const [showM, setShowM] = useState(false);
    const [trainerForm2Message, setTrainerForm2Message] = useState(false);
    const [error2Message, setError2Message] = useState<string[]>([]);

    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
    const [tcknMessage,setTcknMessage]= useState<string>("");

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

useEffect(() => {
  allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
    setCategoryOptions(categoryOptions => [...categoryOptions, new Category({key: option.key, value: option.value, text: option.text})])
));
}, [allCategoriesOptionList])

  
useEffect(() => {
debugger;
  agent.User.loadNewTrainer()
  .then(action((newTrainer) =>
  {
    debugger;
    setTrainerForm(new TrainerFormValues(newTrainer!));
  })).catch((error) => 
     console.log(error)
      
  )
 // setActiveTab(0);
  
   loadAccessibilities();
}, [id])

     const handleAccordionClick = (e:any, titleProps:any) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index

        setActiveIndex(newIndex)
      }


    const handleCategoryChanged = (e: any, data: string[]) => {
        setTrainerForm({...trainerForm,categoryIds: [...data]});
        setCategory(data);  
     }
    
     const handleSubCategoryChanged = (e: any, data: string[]) => {  
         setTrainerForm({...trainerForm,subCategoryIds: [...data]});
        setSubCats(data);
       }

       const handleAccessChanged = (e: any, data: any) => {  
        setTrainerForm({...trainerForm,accessibilityIds: [...data]});
       }
    
    const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> trainerForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
            subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
        ))
        setSubCategoryOptions(subCategoryOptionFilteredList);
        const renewedSubIds = subCat.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
        setSubCats(renewedSubIds);
     }

     const handleCityChanged = (e: any, data: string) => {  
            setCityId(data);
            setTrainerForm({...trainerForm,cityId: data});
     }    
    useEffect(() => {
        loadSubCatOptions();
    }, [category,allCategoriesOptionList]);


   const handleSubmitTrainerForm = (values:ITrainerFormValues) =>{


    const messages = [];
    if(values.categoryIds.length === 0)
    {
      messages.push("Kategori alanı seçimi zorunludur.");
    }
     if(values.subCategoryIds.length === 0){
      messages.push("Alt kategori seçimi zorunludur.");
    }
     if(docs.length === 0){
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
    if(values.tcknIdentityNo && String(values.tcknIdentityNo).length !== 11)
    {
      messages.push("Geçersiz TC Kimlik numarası.")
    }
    
    if(!IBAN.isValid(values.iban))
    {
      messages.push("Geçersiz IBAN numarası.")
    }

    if(messages.length > 0){
      setError2Message(messages);
      setTrainerForm2Message(true);
    }
    else { 
      
      let edittedValues = {
      ...values,
      certificates: docs,
    }
    debugger;
      registerTrainer(edittedValues)
      .catch((error:any) => (
        settrainerRegisteringFalse(),
        setShowM(true),
        console.log(error)
      ))

    }

   
   }



    return (
      <>
      {trainerRegistering ? 
      <>
        <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Sadece 1 dakika</Message.Header>
          Başvurunuzu değerlendirmek üzere yüklüyoruz.
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
          handleSubmitTrainerForm(values)
        }
        initialValues={trainerForm!}
        render={({
          handleSubmit,
          submitting,
          submitError
        }) => (
          <Form onSubmit={handleSubmit} error>
           
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
        <Accordion.Content active={activeIndex === 0}>
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
                  <label>Uzman Alt Kategorisi*</label>
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
                    if(value !== trainerForm.experienceYear)
                    {
                        setTrainerForm({...trainerForm,experienceYear: value});
                    }
                }}
            </OnChange>

                 <label>Yeterlilik Belgesi (Diploma/Sertifika)*</label>
                 {docs.length === 0 && <FileUploadDropzone setDocuments={setDocs} setFiles={setFileDocs} setUpdateEnabled={setUpdateEnabled} /> }
                 {docs.length !== 0 &&
                 <Segment>
                 <List>
                  {docs.map((f, index)=> 
                    <List.Item>
                    <List.Icon name='file' />
                    <List.Content>
                      <List.Header as='a'>{f.name}</List.Header>
                      <List.Description>
                        {f.size}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  )}
                 </List>
                 <Button color="red" content="Dosyaları sil X" onClick={() => setDocs([])}></Button>
                 </Segment>
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
                <label>Çalıştığınız/Bağlı Olduğunuz Kurum*</label>
                <Field name="dependency" placeholder="Şirket Adı / Freelance" component={TextInput} value={trainerForm.dependency}/>
                <OnChange name="dependency">
                    {(value, previous) => {
                     
                        if(value !== trainerForm.dependency)
                        {
                            setTrainerForm({...trainerForm,dependency: value});
                        }
                    }}
                </OnChange>
                <label>Erişilebilirlik</label>
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
        <li>Bu bölümde gireceğiniz bilgiler sistem üzerinde kazandığınız paranın size aktarılması için gerekli bilgilerdir.</li>
        <li>Ödemeler IYZICO şirketi tarafından otomatik gerçekleştirilmektedir.</li>
        <li>Detaylı bilgi, her türlü soru ve istekleriniz için: admin@afitapp.com hesabına mail atabilirsiniz.</li>
        </>}
      />

<>
                    <label className="fieldLabel" id="tcknLabel">TC Kimlik Numarası*</label>
                    <div className="field" style={{display:"flex", flexDirection:"column"}}>
                    <Field
                      labelName="tcknLabel"
                      name="tcknIdentityNo"
                      type="number"
                      placeholder=""
                      value={trainerForm.tcknIdentityNo}
                      component={NumberInput}
                      style={{marginBottom:15}}
                    />
                     </div>         
                        <OnChange name="tcknIdentityNo">
                    {(value, previous) => {
                            setTrainerForm({...trainerForm,tcknIdentityNo: value});
                    }}
                    </OnChange>
                    <label className="fieldLabel" id="ibanlabel">IBAN*</label>
                <Field
                  name="iban"
                  labelName="ibanlabel"
                  placeholder="TR111106200119000006672315"
                  value={trainerForm.iban}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="iban">
                {(value, previous) => {
                          setTrainerForm({...trainerForm,iban: value});
                }}
                </OnChange>

                    </>
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
              color='teal'
              content="Kayıt Ol"
              fluid
              style={{marginTop:"30px"}}
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