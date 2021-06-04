import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Label, Header, Image } from "semantic-ui-react";
import {
  ActivityFormValues
} from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../../app/stores/rootStore";
import ActivityFormMap from "./ActivityFormMap";
import DropdownMultiple from "../../../app/common/form/DropdownMultiple";
import { Category, ICategory } from "../../../app/models/category";
import DropdownInput from "../../../app/common/form/DropdownInput";
import NumberInput from "../../../app/common/form/NumberInput";
import { OnChange } from "react-final-form-listeners";
import WYSIWYGEditor from "../../../app/common/form/WYSIWYGEditor";
import PhotoWidgetDropzone from "../../../app/common/photoUpload/PhotoWidgetDropzone";
import PhotoWidgetCropper from "../../../app/common/photoUpload/PhotoWidgetCropper";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  categoryIds: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
  )(),
  cityId: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})
interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    loadLevels,
    levelList
  } = rootStore.activityStore;

  const {
    cities
  } = rootStore.commonStore;

  const {allCategoriesOptionList} = rootStore.categoryStore;
  const categoryOptions: ICategory[] = [];
  const subCategoryOptionFilteredList: ICategory[] = [];

  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

   const [category, setCategory] = useState<string[]>([]);
   const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

   const [files, setFiles] = useState<any[]>([]);
   const [image, setImage] = useState<Blob | null>(null);
   const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);


  const handleCategoryChanged = (e: any, data: string[]) => {
    if((activity.categories.filter(x => data.findIndex(y => y !== x.key) === -1).length > 0) ||
    (data.filter(x => activity.categories.findIndex(y => y.key !== x) === -1).length > 0))
       setUpdateEnabled(true);

    setActivity({...activity,categoryIds: [...data]});
    setCategory(data);  
  
 }

 const handleSubCategoryChanged = (e: any, data: string[]) => {  
   
  if((activity.subCategories.filter(x => data.findIndex(y => y !== x.key) === -1).length > 0) ||
  (data.filter(x => activity.subCategories.findIndex(y => y.key !== x) === -1).length > 0))
  setUpdateEnabled(true);

      setActivity({...activity,subCategoryIds: [...data]});

   }

   const handleCityChanged = (e: any, data: string) => {  
    if(activity.cityId===null || (activity.cityId !== data))
    setUpdateEnabled(true);
    setActivity({...activity,cityId: data});
    
 }
 const handleLevelChanged = (e: any, data: any) => {  
  setActivity({...activity,levelIds: [...data]});
  setUpdateEnabled(true);
 }
 allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
          categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
     ));
        useEffect(() => {
            loadSubCatOptions();
        }, [category])

     const loadSubCatOptions = () =>{
        allCategoriesOptionList.filter(x=> activity.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
            subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
        ))
        setSubCategoryOptions(subCategoryOptionFilteredList);
        debugger;
        const renewedSubIds = activity.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
        setActivity({...activity,subCategoryIds: [...renewedSubIds]});

     }

  //    const formatPrice = (value:number) =>
  // value === undefined
  //   ? '' // make controlled
  //   : numeral(value).format('0,0.00₺')

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
          let newActivity = {
            ...activity,
            id: uuid(),
          };
          createActivity(newActivity);
        } else {
          editActivity(activity);
        }
  };

  return (
    <Grid stackable>
      <Grid.Row>
      <Grid.Column>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <label>Aktivite Başlığı*</label>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                 <label>Aktivite Liste Fotoğrafı*</label>
                  {
                files.length === 0 ? 
                <div style={{marginBottom:15}}>
                <PhotoWidgetDropzone setFiles={setFiles} />
                </div>
                :
               (
                <Grid>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={225/112}/>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                  </Grid.Column>

                  <Grid.Column width="eight">
                  <Button type="danger" icon='close' disabled={loading} onClick={()=> setFiles([])}>Değiştir/Sil</Button>
                  </Grid.Column>
               </Grid>
               )
         }  
                  <label>Açıklama*</label>
                  <Field
                  name="description"
                  component={WYSIWYGEditor}
                  value={activity.description}
                />
                <label>Kategori*</label>
                 <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  value={activity.categoryIds}
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
                  value={activity.subCategoryIds}
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                />  
                 <label>Seviye*</label>
                <Field
                clearable
                  name="levelIds"
                  placeholder="Seviye"
                  value={activity.levelIds}
                  component={DropdownMultiple}
                  options={levelList}
                  onChange={(e: any,data:any)=>
                    {
                      handleLevelChanged(e,data)}}
                /> 
              <label>Katılımcı Sınırı</label>
             <Field 
                  name="attendancyLimit"
                  type="number"
                  placeholder=""
                  component={NumberInput}
                  value={activity.attendancyLimit}
                  width={4}
                />
                 <OnChange name="attendancyLimit">
                {(value, previous) => {
                    if(value !== activity.attendancyLimit)
                    {
                        setUpdateEnabled(true);
                        setActivity({...activity,attendancyLimit: value});
                    }
                }}
                </OnChange>
                <div style={{marginBottom:15}}>
                  <Field
                      name="online"
                      component="input"
                      type="checkbox"
                      width={4}
                      format={v =>v === true}
                      parse={v => (v ? true : false) }
                    />&nbsp;&nbsp;
                   <span>Online katılma açık</span> 
                </div>
                <OnChange name="online">
                {(value, previous) => {
                    if(value !== activity.online)
                    {
                        setUpdateEnabled(true);
                        setActivity({...activity,online: value});
                    }
                }}
                </OnChange>
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    date={true}
                    placeholder="Date"
                    value={activity.date}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                  />
                  <Field
                    name="time"
                    time={true}
                    placeholder="Time"
                    value={activity.time}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                  />
                </Form.Group>
                <label>Fiyat(TL)*</label>
                <Field
                  name="price"
                  component="input"
                  type="number"
                  value={activity.price}
                  placeholder="0.00₺"
                  style={{marginBottom:15}}
                />
                 <OnChange name="price">
                {(value, previous) => {
                    if(value !== activity.price)
                    {
                        setUpdateEnabled(true);
                        setActivity({...activity,price: value});
                    }
                }}
                </OnChange>
                <label>Şehir</label>
                <Field 
                  name="cityId"
                  placeholder="City"
                  component={DropdownInput}
                  options={cities}
                  value={activity.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
                <label>Mekan</label>
                <Field
                  name="venue"
                  placeholder="Örn: Mac Fit Balçova"
                  value={activity.venue}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                <label>Adres</label>
                 <Field
                  name="Adres"
                  placeholder="Açık adres"
                  value={activity.address}
                  component={TextAreaInput}
                  rows={2}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || !updateEnabled}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="Cancel"
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
      {/* <Grid.Column width={7}>
        <Segment>
    <>  
          <ActivityFormMap />
          </>
           <ActivitySearchPage />
        </Segment>
      </Grid.Column> */}
       </Grid.Row>
      <Grid.Row>
      <Grid.Column width={16}>
        <Segment>
          <ActivityFormMap />
          {/* <ActivitySearchPage /> */}
        </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(ActivityForm);
