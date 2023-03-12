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

const validate = combineValidators({
  displayName: isRequired({message: 'Profil adınız zorunlu alandır.'}),
  title: isRequired({message: 'Uzmanlık ünvanınız zorunlu alandır.'}),
});

interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
  deleteDocument:(id:string) => void;
  categoryOptions:ICategory[];
}


const ProfileUpdateForm: React.FC<IProps> = ({ updateProfile, profile }) => { 
   
    const rootStore = useContext(RootStoreContext);
    const {accessibilities, profileForm, setProfileForm, updatingProfile} = rootStore.profileStore;
    const {cities} = rootStore.commonStore;
    const {allCategoriesOptionList} = rootStore.categoryStore;
    const subCategoryOptionFilteredList: ICategory[] = [];
    const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

     const handleAccessChanged = (e: any, data: any) => {  
         setProfileForm({...profileForm,accessibilityIds: [...data]});
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

   

     const loadSubCatOptions = () =>{
      allCategoriesOptionList.filter(x=> profileForm!.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      const renewedSubIds = profileForm!.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setProfileForm({...profileForm,subCategoryIds: [...renewedSubIds]});
   }

        useEffect(() => {
            loadSubCatOptions();
        }, [])

        const handleSubmitTrainerForm = (values:IProfileFormValues) =>{
          let edittedValues = {
            ...values,
            trainerUserName: profile.userName
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
          <Field
            label="Profil ismi*"
            labelName="nameLabel"
            name='displayName'
            component={TextInput}
            placeholder='Profil ismi'
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
          <Field
            label="Ünvan*"
            labelName="titlelabel"
            name='title'
            component={TextInput}
            maxLength={100}
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
          <Field
            label="Özet tanıtım (Bio)"
            name='bio'
            labelName="bioLabel"
            component={TextAreaInput}
            rows={3}
            maxLength={500}
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
          <Field
          label="Referans tecrübeler"
          labelName="experienceLabel"
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
           <Field 
                  width={3}
                  label="Tecrübe (yıl)"
                  labelName="experienceYearLabel"
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
                <Field 
                label="Şehir*"
                  name="cityId"
                  placeholder="City"
                  component={DropdownInput}
                  options={cities}
                  value={profileForm!.cityId}
                  labelName="citylabel"
                  emptyError={profileForm.cityId}
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
                 {/* <label id="categoryLabel">Kategori*</label>
                 <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  value={profileForm!.categoryIds}
                  component={DropdownMultiple}
                  options = {categoryOptions}
                  labelName="categoryLabel"
                  emptyError={profileForm.categoryIds}
                  onChange={(e: any,data:any)=>
                    {
                      debugger;
                      handleCategoryChanged(e,data)}}
                />  */}
                 <label id="subCatLabel">Branşlar*</label>        
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={profileForm!.subCategoryIds}
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  labelName="subCatLabel"
                  emptyError={profileForm.subCategoryIds}
                  onChange={(e: any,data:[])=>
                    {
                      
                      handleSubCategoryChanged(e,data)
                      setUpdateEnabled(true)}}
                />  
              
          <Field
            name='dependency'
            component={TextInput}
            rows={1}
            maxLength={200}
            label="Çalıştığınız Kurum/Freelance"
            labelName="dependencyLabel"
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
            loading={submitting|| updatingProfile}
            floated='right'
            disabled={!updateEnabled || updatingProfile}
            positive
            circular
            content='Güncelle'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileUpdateForm);