import { observer } from 'mobx-react-lite';
import React, { useContext,useState } from 'react'
import {  Button,Form } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { Form as FinalForm, Field } from "react-final-form";
import {
  ActivityFormValues
} from "../../app/models/activity";
import SelectInput from "../../app/common/form/SelectInput";
import { category } from "../../app/common/options/categoryOptions";


const ProfileListFilters: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = rootStore.activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

 

  const handleFinalFormSubmit = (values: any) => {
    
  };

  return (
   
        <FinalForm
            // initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading} >
                <Form.Group style={{alignItems:"center", margin:"0px"}} stackable>
                <Field 
                  name="category"
                  placeholder="Kategori"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                 <Field
                  name="abc"
                  placeholder="Alt Kategori"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                  <Field
                  name="online"
                  placeholder="Tecrübe"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
	            	<Field
                  name="city"
                  placeholder="Şehir"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                	<Field
                  name="online"
                  placeholder="Hizmet tipi"
                  value={activity.category}
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
