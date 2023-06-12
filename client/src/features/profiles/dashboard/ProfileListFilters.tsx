import { observer } from 'mobx-react-lite';
import React, { useContext,useState } from 'react'
import {  Button,Form } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from "react-final-form";
import SelectInput from "../../../app/common/form/SelectInput";
import DropdownInput from '../../../app/common/form/DropdownInput';
import DropdownMultiple from '../../../app/common/form/DropdownMultiple';
import {  ProfileFilterFormValues } from '../../../app/models/profile';
import { OnChange } from 'react-final-form-listeners';


const ProfileListFilters: React.FC = () => {
  const rootStore = useStore();
  const {
     categoryList,
     subcategoryList,
     loadingCategories,
     loadingSubCategories,
     loadSubCategories
  } = rootStore.categoryStore;
  const {
    cities
 } = rootStore.commonStore;

  const {accessibilities, profileFilterForm, setProfileFilterForm, loadPopularProfiles, 
    clearPopularProfileRegistery ,clearProfileRegistery,setPage, setNavSearchValue,setprofileSearchAreaValue} = rootStore.profileStore;

  //const [filters, setFilters] = useState(new ProfilesFilterFormValues());
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleFinalFormSubmit = (values: any) => {
    
  };

  const handleCategoryChanged = (e: any, data: string) => {
    if(data !== profileFilterForm!.categoryId)
    {
     setProfileFilterForm({...profileFilterForm,categoryId: data,subCategoryIds:[]});
     data !== "" && loadSubCategories(data);
     setButtonDisabled(false);
    }
  }
     
   const handleSubCategoryChanged = (e: any, data: string[]) => {  
    setProfileFilterForm({...profileFilterForm,subCategoryIds: [...data]});
    setButtonDisabled(false);
   }
   const handleCityChanged = (e: any, data: string) => {  

    if(data !== profileFilterForm!.cityId)
    {
      setProfileFilterForm({...profileFilterForm,cityId: data});
      setButtonDisabled(false);
    }
 }


 const handleAccessibilityChange =(e: any, data: string) => {  

  if(data !== profileFilterForm!.accessibilityId)
  {
    setProfileFilterForm({...profileFilterForm,accessibilityId: data});
    setButtonDisabled(false);
  }
}
  return (
   
   
        <FinalForm
            initialValues={profileFilterForm}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form className="profileFilterForm" onSubmit={handleSubmit} >
                <Form.Group style={{alignItems:"center"}}>
                <Field 
                  name="categoryId"
                  width={3}
                  placeholder="Kategori"
                  component={DropdownInput}
                  options={categoryList}
                  loading={loadingCategories}
                  value={profileFilterForm!.categoryId}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleCategoryChanged(e,data)}
                />
                 <Field
                 width={5}
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={profileFilterForm!.subCategoryIds}
                  component={DropdownMultiple}
                  options={subcategoryList}
                  loading={loadingSubCategories}
                  onChange={(e: any,data: any)=>handleSubCategoryChanged(e,data)}
                > 
              </Field>
                 <Field 
                  name="cityId"
                  width={3}
                  placeholder="Şehir"
                  component={DropdownInput}
                  options={cities}
                  value={profileFilterForm!.cityId}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                />
                	<Field
                   width={3}
                  name="accessibilityId"
                  placeholder="Erişilebilirlik"
                  value={profileFilterForm!.accessibilityId}
                  component={DropdownInput}
                  options={accessibilities}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleAccessibilityChange(e,data)}

                />
               <div className="profileFilterButtons" >
               <Button
                 // loading={submitting}
                  disabled={buttonDisabled}
                  floated="right"
                  type="submit"
                  content="Ara"
                  circular
                  className='orangeBtn'
                  style={{marginRight:"10px"}}
                  onClick={() => {
                    clearPopularProfileRegistery();
                    clearProfileRegistery();
                    setPage(0);
                    loadPopularProfiles();
                    document.querySelector('body')!.scrollTo({
                      top:220,
                      behavior: 'smooth'
                    })

                  }}
                />
                <Button
                  floated="left"
                  type="cancel"
                  content="Temizle"
                  circular
                  onClick={() =>{
                    setProfileFilterForm(new ProfileFilterFormValues( {categoryId:"", subCategoryIds:[], cityId:"", accessibilityId:"", followingTrainers:false}));
                    setButtonDisabled(false);
                    clearPopularProfileRegistery();
                    clearProfileRegistery();
                    setPage(0);
                    loadPopularProfiles();
                    setNavSearchValue("");
                    setprofileSearchAreaValue("");
                    document.querySelector('body')!.scrollTo({
                      top:220,
                      behavior: 'smooth'
                    })

                  }
                  }
                />
               </div>
               
                  </Form.Group>
              </Form>
            )}
          />
    
  );
};

export default observer(ProfileListFilters);
