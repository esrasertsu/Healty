import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Confirm, Form,  Icon, List, Message,Segment, Tab } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
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

    const [category, setCategory] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();
    const [showM, setShowM] = useState(false);
    const [trainerForm2Message, setTrainerForm2Message] = useState(false);
    const [error2Message, setError2Message] = useState<string[]>([]);
    const [userConfirmOpen, setUserConfirmOpen] = useState(false);

    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    
    
useEffect(() => {
  allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
    setCategoryOptions(categoryOptions => [...categoryOptions, new Category({key: option.key, value: option.value, text: option.text})])
));
}, [allCategoriesOptionList])

  
useEffect(() => {

  agent.User.loadNewTrainer()
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


    const handleSendToConfirm = (e:any) =>{
       e && e.preventDefault();
       setUserConfirmOpen(true);

    }

    const handleSaveTrainerForm = (e:any,values:ITrainerFormValues) =>{
      setTrainerForm2Message(false);
      debugger;
      e && e.preventDefault();
      let edittedValues = {
        ...values,
        documents: docs,
      }
        registerTrainer(edittedValues).then((res) => 
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
     if(values.subCategoryIds.length === 0){
      messages.push("Branş / Alt kategori seçimi zorunludur.");
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

    if(user!.isSubMerchant === false)
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

   const handleDeleteDoc = (id:string) => {
    deleteDocument(id);
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
          handleSaveTrainerForm(null,values)
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
                      <Button color="red" size="mini" disabled={deletingDocument} onClick={() => handleDeleteDoc(f.id)} style={{marginLeft:"10px", cursor:"pointer"}} content={"Sil"} icon="trash"></Button>
                    </List.Content>
                  </List.Item>
                  )}
                 </List>
                 </Segment>
                 }      
                 {docs.length === 0 && <FileUploadDropzone setDocuments={setDocs} setFiles={setFileDocs} setUpdateEnabled={setUpdateEnabled} /> }
                 {docs.length !== 0 &&
                 <Segment>
                 <List>
                  {docs.map((f, index)=> 
                    <List.Item key={"docs_"+index}>
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
                  color="blue"
                  labelPosition="right"
                  icon="save"
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
    <SubMerchantDetails />
     
   
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
              color="green"
              content="Başvuruyu Gönder"
              floated="right"
              icon="send"
              labelPosition='right'
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