import React, { useContext, useEffect, useState } from 'react';
import { IProfile } from '../../app/models/profile';
import { Category, ICategory } from '../../app/models/category';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import NumberInput from '../../app/common/form/NumberInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { RootStoreContext } from '../../app/stores/rootStore'
import DropdownInput from '../../app/common/form/DropdownInput';
import { toast } from 'react-toastify';
import { profileEnd } from 'console';
import { OnChange } from 'react-final-form-listeners';

const validate = combineValidators({
  displayName: isRequired('displayName')
});

interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
}


const ProfileUpdateForm: React.FC<IProps> = ({ updateProfile, profile }) => {
   
    const rootStore = useContext(RootStoreContext);
    const {accessibilities, profileForm, setProfileForm} = rootStore.profileStore;
    const {allCategoriesOptionList} = rootStore.categoryStore;
    const {cities} = rootStore.commonStore;
    const categoryOptions: ICategory[] = [];
    const subCategoryOptionFilteredList: ICategory[] = [];

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);


     const [category, setCategory] = useState<string[]>([]);
     const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

     const handleAccessChanged = (e: any, data: any) => {  
         setProfileForm({...profileForm,accessibilityIds: [...data]});
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
        if(profile.city.key !== data)
            setUpdateEnabled(true);
     }

    allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
          categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
     ));
        useEffect(() => {
            loadSubCatOptions();
        }, [category])

     const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> profileForm!.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
            subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
        ))
        setSubCategoryOptions(subCategoryOptionFilteredList);
        const renewedSubIds = profileForm!.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(x => x.key) > -1);
        setProfileForm({...profileForm,subCategoryIds: [...renewedSubIds]});

     }

  return (
    <FinalForm
      onSubmit={updateProfile}
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
                      debugger;
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
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                />  
            <label>Sertifikalar</label>          
           <Field
            name='certificates'
            component={TextAreaInput}
            rows={1}
            allowNull
            placeholder='Sertifikalar'
            value={profileForm!.certificates}
          />
          <OnChange name="certificates">
            {(value, previous) => {
                if(value !== profile.certificates)
                {
                    setUpdateEnabled(true);
                    setProfileForm({...profileForm,certificates: value});
                }
            }}
            </OnChange>
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
            content='Update profile'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileUpdateForm);