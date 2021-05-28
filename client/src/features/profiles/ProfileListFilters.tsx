import { observer } from 'mobx-react-lite';
import React, { useContext,useEffect,useState } from 'react'
import {  Button,Dimmer,Form, Loader } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { Form as FinalForm, Field } from "react-final-form";
import {
  ProfilesFilterFormValues
} from "../../app/models/profile";
import SelectInput from "../../app/common/form/SelectInput";
import { category } from "../../app/common/options/categoryOptions";
import DropdownInput from '../../app/common/form/DropdownInput';


const ProfileListFilters: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
     categoryList,
     subcategoryList,
     loadingCategories,
     loadingSubCategories,
     loadCategories,
     loadSubCategories
  } = rootStore.categoryStore;

  const [filters, setFilters] = useState(new ProfilesFilterFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
}, [loadCategories])

  const handleFinalFormSubmit = (values: any) => {
    
  };

  const handleCategoryChanged = (e: any, data: string) => {
     setFilters({...filters,category: data});
     loadSubCategories(data);
  }

  const handleSubCategoryChanged = (e: any, data: string) => {    
         setFilters({...filters,subCategory: data});
      }
  return (
   
        <FinalForm
            initialValues={filters}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading} >
                <Form.Group style={{alignItems:"center", margin:"0px"}} stackable>
                <Field 
                  name="category"
                  placeholder="Kategori"
                  component={DropdownInput}
                  options={categoryList}
                  value={filters.category}
                  onChange={(e: any,data: any)=>handleCategoryChanged(e,data)}
                />
                 <Field
                  name="subCategory"
                  placeholder="Alt Kategori"
                  value={filters.subCategory}
                  component={DropdownInput}
                  options={subcategoryList}
                  onChange={(e: any,data: any)=>handleSubCategoryChanged(e,data)}
                > 
              </Field>
                   <Field
                  name="gender"
                  placeholder="Cinsiyet"
               //   value={activity.category}
                  component={SelectInput}
                  options={category}
                /> 
	            	<Field
                  name="city"
                  placeholder="Şehir"
               //   value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                	<Field
                  name="online"
                  placeholder="Hizmet tipi"
                //  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
               
                <Button
                 // loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Ara"
                  style={{marginRight:"10px"}}
                />
                <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="Temizle"
                  // onClick={
                  //   activity.id
                  //     ? () => history.push(`/activities/${activity.id}`)
                  //     : () => history.push("/activities")
                  // }
                />
                  </Form.Group>
              </Form>
            )}
          />
    
  );
};

export default observer(ProfileListFilters);
