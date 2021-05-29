import React, { useContext, useEffect, useState } from 'react';
import { IProfile } from '../../app/models/profile';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import NumberInput from '../../app/common/form/NumberInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { RootStoreContext } from '../../app/stores/rootStore'

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
    const {categoryList,loadSubCategories,subcategoryList,allDetailedList} = rootStore.categoryStore;

    const [accessibilityChoice, setAccessibilityChoice] =useState<string[]>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subCategory, setSubCategory] =useState<string[]>([]);

     const handleAccessChanged = (e: any, data: any) => {  
         debugger;
         setProfileForm({...profileForm,accessibilityIds: [...data]});
         setAccessibilityChoice(data);
        }

       const handleCategoryChanged = (e: any, data: string[]) => {
        debugger;
        setProfileForm({...profileForm,categoryIds: [...data]});
        setCategory(data)  

        loadSubCategories(data[0]);
     }

     const handleSubCategoryChanged = (e: any, data: string[]) => {  
          setSubCategory(data)  
          setProfileForm({...profileForm,subCategoryIds: [...data]});
       }

       useEffect(() => {
           debugger;

       }, [profile])

  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profileForm!}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
            value={profileForm!.displayName}
          />
          <Field
            name='bio'
            component={TextAreaInput}
            rows={3}
            placeholder='Özet'
            value={profileForm!.bio}
          />
          <Field
            name='experience'
            component={TextAreaInput}
            rows={2}
            allowNull
            placeholder='Tecrübe'
            value={profileForm!.experience}
          />
           <Field 
                  width={2}
                  name="experienceYear"
                  type="number"
                  placeholder="Tecrübe (Yıl)"
                  component={NumberInput}
                  value={profileForm!.experienceYear}
                />
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
                 <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  value={profileForm!.categoryIds}
                  component={DropdownMultiple}
                  options={allDetailedList.filter(x=>x.parentId===null)}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleCategoryChanged(e,data)}}
                />         
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={profileForm!.subCategoryIds}
                  component={DropdownMultiple}
                  options={subcategoryList.length>0 ? subcategoryList : allDetailedList.filter(x=> profileForm!.categoryIds.findIndex(y=> y === x.parentId!) > -1)}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                />                
           <Field
            name='certificates'
            component={TextAreaInput}
            rows={1}
            allowNull
            placeholder='Sertifikalar'
            value={profile!.certificates}
          />
          <Field
            name='dependency'
            component={TextInput}
            rows={1}
            allowNull
            placeholder='Çalıştığı Kurum/Freelance'
            value={profile!.dependency}
          />
          <Button 
            loading={submitting}
            floated='right'
            disabled={invalid || pristine}
            positive
            content='Update profile'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileUpdateForm);