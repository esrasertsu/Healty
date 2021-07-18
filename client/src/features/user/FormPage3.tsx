import { FORM_ERROR } from 'final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Grid, Header, Icon, Image, Label, List, Message, Placeholder, Segment } from 'semantic-ui-react';
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


const validate = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password')
})
interface IProps {
  location: string;
}
const FormPage3:React.FC<IProps> = ({location}) =>{
    const rootStore = useContext(RootStoreContext);
    const { registerTrainer,trainerRegistering,trainerRegisteredSuccess,settrainerRegisteringFalse } = rootStore.userStore;
    const { cities } = rootStore.commonStore;

    
   const [files, setFiles] = useState<any[]>([]);
   const [image, setImage] = useState<Blob | null>(null);
   const [originalImage, setOriginalImage] = useState<Blob | null>(null);

   const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
   const [imageChange, setImageChange] = useState(false);
   const [imageDeleted, setImageDeleted] = useState(false);

   const [docs, setDocs] = useState<any[]>([]);
   const [filedocs, setFileDocs] = useState<any[]>([]);
   const [updateEnabled, setUpdateEnabled] = useState(false);

   
    
  const {allCategoriesOptionList} = rootStore.categoryStore;
  const {trainerForm, setTrainerForm} = rootStore.userStore;

  let subCategoryOptionFilteredList: ICategory[] = [];

    const [category, setCategory] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();
    const [showM, setShowM] = useState(false);

    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);

useEffect(() => {
  allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
    setCategoryOptions(categoryOptions => [...categoryOptions, new Category({key: option.key, value: option.value, text: option.text})])
));
}, [allCategoriesOptionList])
  
useEffect(() => {
   setTrainerForm(new TrainerFormValues());
}, [])

    const handleCategoryChanged = (e: any, data: string[]) => {
        setTrainerForm({...trainerForm,categoryIds: [...data]});
        setCategory(data);  
     }
    
     const handleSubCategoryChanged = (e: any, data: string[]) => {  
         setTrainerForm({...trainerForm,subCategoryIds: [...data]});
        setSubCats(data);
       }
    
    const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> category.findIndex(y=> y === x.parentId!) > -1).map(option => (
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
    let edittedValues = {
      ...values,
      photo: image,
      certificates: docs
    }
      registerTrainer(edittedValues,location)
      .catch((error:any) => (
        settrainerRegisteringFalse(),
        setShowM(true),
        console.log(error)
      ))
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
     { showM && <Message
      error
      header='Başvuru formunuz hatalı!'
      content='Lütfen formu eksiksiz ve doğru şekilde doldurunuz.'
    />}
        <FinalForm
        onSubmit={(values: ITrainerFormValues) =>
          handleSubmitTrainerForm(values)
        }
        validate={validate}
        initialValues={trainerForm!}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Uzman Kayıt Formu"
              color="teal"
              textAlign="center"
            />
           <label>Kullanıcı Adı*</label>
            <Field name="username" placeholder="Kullanıcı Adı" component={TextInput} value={trainerForm.username}/>
            <OnChange name="username">
                {(value, previous) => {
                  debugger;
                    if(value !== trainerForm.username)
                    {
                        setTrainerForm({...trainerForm,username: value});
                    }
                }}
            </OnChange>
            <label>Ad Soyad*</label>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} value={trainerForm.displayname}/>
            <OnChange name="displayname">
                {(value, previous) => {
                    if(value !== trainerForm.displayname)
                    {
                        setTrainerForm({...trainerForm,displayname: value});
                    }
                }}
            </OnChange>
            <label>Email*</label>
            <Field name="email" placeholder="Email" component={TextInput} value={trainerForm.email}/>
            <OnChange name="email">
                {(value, previous) => {
                    if(value !== trainerForm.email)
                    {
                        setTrainerForm({...trainerForm,email: value});
                    }
                }}
            </OnChange>
            <label>Şifre*</label>
            <Field
              name="password"
              placeholder="Şifre"
              type="password"
              component={TextInput}
              value={trainerForm.password}
            />
            <OnChange name="password">
                {(value, previous) => {
                    if(value !== trainerForm.password)
                    {
                        setTrainerForm({...trainerForm,password: value});
                    }
                }}
            </OnChange>
            <br></br>
            <label>Profil Fotoğrafı*</label>
           { files.length === 0 ? 
                <div style={{marginBottom:15}}>
                <PhotoWidgetDropzone setFiles={setFiles} />
                </div>
                :
               (
                <Grid style={{marginTop:"10px"}}>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={1}/>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                  </Grid.Column>

                  <Grid.Column width="eight">
                  <div style={{display:"flex"}}>
                  <Label style={{marginBottom:"20px", marginRight:"20px", cursor:"pointer"}} 
                  onClick={()=> {setFiles([]);setImageDeleted(true);}}>Değiştir/Sil <Icon name="trash"></Icon></Label>
                  <Label style={{marginBottom:"20px", cursor:"pointer"}} onClick={()=> {
                  setImageChange(false); setImageDeleted(false); setFiles([])}}>Değişiklikleri geri al <Icon name="backward"></Icon> </Label>   
                  </div>             
                  </Grid.Column>
               </Grid>
               )
                  }
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
                      debugger;
                        if(value !== trainerForm.dependency)
                        {
                            setTrainerForm({...trainerForm,dependency: value});
                        }
                    }}
                </OnChange>
                 <label>Açıklama*</label>
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
            {submitError && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
            <Button
              disabled={(invalid)}
              loading={submitting}
              color='teal'
              content="Kayıt Ol"
              fluid
            />
          </Form>
        )}
      />
      </>
       }
    
      </>
    );
}


export default observer(FormPage3)