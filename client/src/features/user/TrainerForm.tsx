import { FORM_ERROR } from 'final-form';
import React, { useContext, useEffect, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Grid, Header, Icon, Image, Label } from 'semantic-ui-react';
import DropdownInput from '../../app/common/form/DropdownInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import PhotoWidgetCropper from '../../app/common/photoUpload/PhotoWidgetCropper';
import PhotoWidgetDropzone from '../../app/common/photoUpload/PhotoWidgetDropzone';
import { Category, ICategory } from '../../app/models/category';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';


const validate = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password')
})
interface IProps {
  location: string;
}
export const TrainerForm:React.FC<IProps> = ({location}) =>{
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
    const { cities } = rootStore.commonStore;

    
   const [files, setFiles] = useState<any[]>([]);
   const [image, setImage] = useState<Blob | null>(null);
   const [originalImage, setOriginalImage] = useState<Blob | null>(null);

   const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
   const [imageChange, setImageChange] = useState(false);
   const [imageDeleted, setImageDeleted] = useState(false);
    
  const {allCategoriesOptionList} = rootStore.categoryStore;
  let categoryOptions: ICategory[] = [];
  let subCategoryOptionFilteredList: ICategory[] = [];

    const [category, setCategory] = useState<string[]>([]);
    const [subCat, setSubCats] = useState<string[]>([]);
    const [cityId, setCityId] = useState<string>();

    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

    const handleCategoryChanged = (e: any, data: string[]) => {
      //  setActivityForm({...activityForm, categoryIds: [...data]});
        setCategory(data);  
      
     }
    
     const handleSubCategoryChanged = (e: any, data: string[]) => {  
        // setActivityForm({...activityForm,subCategoryIds: [...data]});
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
     }    
    useEffect(() => {
        loadSubCatOptions();
    }, [category,allCategoriesOptionList]);

    return (
      <>
      {/* <Image size='large' src='/assets/Login1.png' wrapped /> */}
      <FinalForm
        onSubmit={(values: IUserFormValues) =>
            register(values,location)
            .catch((error) => ({
            [FORM_ERROR]: error,
          }))
        }
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Uzman Kayıt Formu"
              color="teal"
              textAlign="center"
            />
           <label>Kullanıcı Adı</label>
            <Field name="username" placeholder="Kullanıcı Adı" component={TextInput}/>
            <label>Ad Soyad</label>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} />
            <label>Email</label>
            <Field name="email" placeholder="Email" component={TextInput} />
            <label>Şifre</label>
            <Field
              name="password"
              placeholder="Şifre"
              type="password"
              component={TextInput}
            />
            <br></br>
            <label>Profil Fotoğrafı</label>
           { files.length === 0 ? 
                <div style={{marginBottom:15}}>
                <PhotoWidgetDropzone setFiles={setFiles} />
                </div>
                :
               (
                <Grid style={{marginTop:"10px"}}>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={278/174}/>
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
             <label>Uzman Kategorisi</label>
            <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  component={DropdownMultiple}
                  options = {categoryOptions}
                  value={category}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleCategoryChanged(e,data)}}
                /> 
                  <label>Uzman Alt Kategorisi</label>
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  value={subCat}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                />  
               <label>Şehir</label>
                <Field 
                  name="cityId"
                  placeholder="Şehir"
                  value={cityId}
                  component={DropdownInput}
                  options={cities}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
                 <label>Açıklama</label>
                 <Field
                  name="desc"
                  placeholder="Açıklama"
                  component={TextAreaInput}
                />
            {submitError && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content="Kayıt Ol"
              fluid
            />
          </Form>
        )}
      />
      </>
    );
}
