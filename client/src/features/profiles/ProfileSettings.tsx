import React, { useContext, useEffect, useState } from 'react';
import { IProfile, IProfileFormValues } from '../../app/models/profile';
import { Category, ICategory } from '../../app/models/category';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button, List, Segment, Icon } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import NumberInput from '../../app/common/form/NumberInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { RootStoreContext } from '../../app/stores/rootStore'
import DropdownInput from '../../app/common/form/DropdownInput';
import { OnChange } from 'react-final-form-listeners';
import FileUploadDropzone from '../../app/common/util/FileUploadDropzone';

const validate = combineValidators({
  displayName: isRequired('displayName'),
  title: isRequired('title')
});

interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
  deleteDocument:(id:string) => void;
}


const ProfileSettings: React.FC<IProps> = ({ updateProfile, profile,deleteDocument }) => {
   
    const rootStore = useContext(RootStoreContext);
    const {accessibilities, profileForm, setProfileForm, deletingDocument} = rootStore.profileStore;
    const {allCategoriesOptionList} = rootStore.categoryStore;
    const {cities} = rootStore.commonStore;
    const categoryOptions: ICategory[] = [];
    const subCategoryOptionFilteredList: ICategory[] = [];

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

    
   const [docs, setDocs] = useState<any[]>([]);
   const [filedocs, setFileDocs] = useState<any[]>([]);


     const [category, setCategory] = useState<string[]>([]);
     const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

     const handleAccessChanged = (e: any, data: any) => {  
         setProfileForm({...profileForm,accessibilityIds: [...data]});
         setUpdateEnabled(true);
        }

       const handleCategoryChanged = (e: any, data: string[]) => {
        setProfileForm({...profileForm,categoryIds: [...data]});
        setCategory(data);  
        if((profile.categories.filter(x => data.findIndex(y => y !== x.key) === -1).length > 0) ||
        (data.filter(x => profile.categories.findIndex(y => y.key !== x) === -1).length > 0))
           setUpdateEnabled(true);
     }

     const handleSubCategoryChanged = (e: any, data: string[]) => {  
          setProfileForm({...profileForm,subCategoryIds: [...data]});

          if((profile.subCategories.filter(x => data.findIndex(y => y !== x.key) === -1).length > 0) ||
            (data.filter(x => profile.subCategories.findIndex(y => y.key !== x) === -1).length > 0))
            setUpdateEnabled(true);
       }

       const handleCityChanged = (e: any, data: string) => {  
        setProfileForm({...profileForm,cityId: data});
        if(profile.city===null || (profile.city && profile.city.key !== data))
            setUpdateEnabled(true);
     }

    allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
          categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
     ));

     const loadSubCatOptions = () =>{
      allCategoriesOptionList.filter(x=> profileForm!.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      const renewedSubIds = profileForm!.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setProfileForm({...profileForm,subCategoryIds: [...renewedSubIds]});
   }

   const handleDeleteDoc = (id:string) => {
       deleteDocument(id);
   }
        useEffect(() => {
            loadSubCatOptions();
        }, [category])

        const handleSubmitTrainerForm = (values:IProfileFormValues) =>{
          let edittedValues = {
            ...values,
            documents: docs
          }
            updateProfile(edittedValues);
            
         }

  return (
    <FinalForm
      onSubmit={handleSubmitTrainerForm}
      validate={validate}
      initialValues={profileForm!}
      render={({ handleSubmit, invalid, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <label>Ad Soyad*</label>
          <Field
            label="Ad/Soyad"
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
            value={profileForm!.displayName}
          />
           <OnChange name="displayName">
                {(value, previous) => {
                    if(value !== profile.displayName)
                    {
                        setUpdateEnabled(true);
                        setProfileForm({...profileForm,displayName: value});
                    }
                }}
            </OnChange>
            <label>Ünvan*</label>
          <Field
            name='title'
            component={TextInput}
            placeholder='Örn: Kişisel Gelişim Uzmanı / Personal Trainer / Pedagog'
            value={profileForm!.title}
          />
           <OnChange name="title">
                {(value, previous) => {
                    if(value !== profile.title)
                    {
                        setUpdateEnabled(true);
                        setProfileForm({...profileForm,title: value});
                    }
                }}
            </OnChange>
          <label>Özet tanıtım</label>
          <Field
            name='bio'
            component={TextAreaInput}
            rows={3}
            placeholder='Özet'
            value={profileForm!.bio}
          />
           <OnChange name="bio">
                {(value, previous) => {
                    if(value !== profile.bio)
                    {
                        setUpdateEnabled(true);
                        setProfileForm({...profileForm,bio: value});
                    }
                }}
            </OnChange>
          <label>Referans tecrübeler</label>
          <Field
            name='experience'
            component={TextAreaInput}
            rows={2}
            placeholder='Tecrübe'
            value={profileForm!.experience}
          />
           <OnChange name="experience">
                {(value, previous) => {
                    if(value !== profile.experience)
                    {
                        setUpdateEnabled(true);
                        setProfileForm({...profileForm,experience: value});
                    }
                }}
            </OnChange>
           <label>Tecrübe (Yıl)</label>
           <Field 
                  width={2}
                  name="experienceYear"
                  type="number"
                  placeholder="Tecrübe (Yıl)"
                  component={NumberInput}
                  value={profileForm!.experienceYear}
                />
                 <OnChange name="experienceYear">
                {(value, previous) => {
                    if(value !== profile.experienceYear)
                    {
                        setUpdateEnabled(true);
                        setProfileForm({...profileForm,experienceYear: value});
                    }
                }}
            </OnChange>
                <label>Şehir*</label>
                <Field 
                  name="cityId"
                  placeholder="City"
                  component={DropdownInput}
                  options={cities}
                  value={profileForm!.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                />
                <label>Erişilebilirlik</label>
                <Field
                clearable
                  name="accessibilityIds"
                  placeholder="Erişilebilirlik"
                  value={profileForm!.accessibilityIds}
                  component={DropdownMultiple}
                  options={accessibilities}
                  onChange={(e: any,data:any)=>
                    {
                      handleAccessChanged(e,data)}}
                /> 
                 <label>Kategori*</label>
                 <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  value={profileForm!.categoryIds}
                  component={DropdownMultiple}
                  options = {categoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      handleCategoryChanged(e,data)}}
                /> 
                 <label>Branşlar*</label>        
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={profileForm!.subCategoryIds}
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      handleSubCategoryChanged(e,data)}}
                />  
            <label>Eğitim Bilgileri (Diploma/Sertifika)</label>    
            {profileForm.certificates && profileForm.certificates.length !== 0 &&
                 <Segment>
                 <List>
                  {profileForm.certificates.map((f, index)=> 
                    <List.Item style={{display:"flex"}}>
                    <List.Icon name='file' />
                    <List.Content style={{display:"flex"}}>
                      <List.Header as='a'>{f.name}</List.Header> 
                      <Button circular color="red" size="mini" disabled={deletingDocument} onClick={() => handleDeleteDoc(f.id)} style={{marginLeft:"10px", cursor:"pointer"}} content={"Sil"} icon="trash"></Button>
                    </List.Content>
                  </List.Item>
                  )}
                 </List>
                 </Segment>
                 }      
            {profileForm.documents.length === 0 && <FileUploadDropzone setDocuments={setDocs} setFiles={setFileDocs} setUpdateEnabled={setUpdateEnabled} /> }
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
                 <Button circular color="red" content="Dosyaları sil X" onClick={() => setDocs([])}></Button>
                 </Segment>
                 }
          
           <label>Çalıştığınız Kurum/Freelance</label>        
          <Field
            name='dependency'
            component={TextInput}
            rows={1}
            allowNull
            placeholder='Çalıştığınız Kurum/Freelance'
            value={profileForm!.dependency}
          />
          <OnChange name="dependency">
            {(value, previous) => {
                if(value !== profile.dependency)
                {
                    setUpdateEnabled(true);
                    setProfileForm({...profileForm,dependency: value});
                }
            }}
            </OnChange>
          <Button 
            loading={submitting}
            floated='right'
            disabled={!updateEnabled}
            positive
            circular
            content='Güncelle'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileSettings);