import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Label, Header, Image, Icon } from "semantic-ui-react";
import {
  ActivityFormValues, IActivityFormValues
} from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
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
import { action } from "mobx";
import { toast } from "react-toastify";

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
    activity,
    activityForm,
    setActivityForm,
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
  let categoryOptions: ICategory[] = [];
  let subCategoryOptionFilteredList: ICategory[] = [];

  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

   const [category, setCategory] = useState<string[]>([]);
   const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

   const [files, setFiles] = useState<any[]>([]);
   const [image, setImage] = useState<Blob | null>(null);
   const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
   const [emptyAtivityForm, setEmptyActivityForm] = useState(new ActivityFormValues());
   const [activityDesc, setActivityDesc] = useState<string>("");
   const [imageChange, setImageChange] = useState(false);
   const [imageDeleted, setImageDeleted] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(action((activity) => {
          setActivityForm(new ActivityFormValues(activity!));
          setActivityDesc(activity!.description);
        }))
        .finally(() => setLoading(false));
    }
    return () => {
      setActivityForm(new ActivityFormValues());
    }
  }, [loadActivity,match.params.id]);

  const handleCategoryChanged = (e: any, data: string[]) => {

    setActivityForm({...activityForm,categoryIds: [...data]});
    setCategory(data);  
  
 }

 const handleSubCategoryChanged = (e: any, data: string[]) => {  

  setActivityForm({...activityForm,subCategoryIds: [...data]});

   }

   const handleCityChanged = (e: any, data: string) => {  
    if(activityForm.cityId===null || (activityForm.cityId !== data))
    setUpdateEnabled(true);
    setActivityForm({...activityForm,cityId: data});
    
 }
 const handleLevelChanged = (e: any, data: any) => {  
  setActivityForm({...activityForm,levelIds: [...data]});
  setUpdateEnabled(true);
 }
      allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
        categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
      ));

     const loadSubCatOptions = () =>{
       debugger;
      allCategoriesOptionList.filter(x=> activityForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      debugger;
      const renewedSubIds = activityForm.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setActivityForm({...activityForm,subCategoryIds: [...renewedSubIds]});

   }
        useEffect(() => {
          debugger;
            loadSubCatOptions();
        }, [category,allCategoriesOptionList]);
        useEffect(() => {
          loadLevels();
      }, []);
   
const handleDateChange = (date:any) =>{

  const dateAndTime = activityForm.time ? combineDateAndTime(date, activityForm.time): combineDateAndTime(date, new Date());
  setActivityForm({...activityForm, date: dateAndTime});
}

const handleTimeChange = (time:any) =>{
  const dateAndTime = activityForm.date ? combineDateAndTime(activityForm.date!, time) : combineDateAndTime(new Date(), time);
  setActivityForm({...activityForm, time: dateAndTime});
}

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
          let newActivity = {
            ...activity,
            photo: image,
            id: uuid(),
          };
          createActivity(newActivity);
        } else {
          debugger;
          if(!imageDeleted)
          {
            if(!imageChange)
            {
              let editedActivity = {
                ...activity
              }
              editActivity(editedActivity);
            }else {
              let editedActivity = {
                ...activity,
                photo: image
              }
              editActivity(editedActivity);
            }
          
          }else 
          {
              toast.warning("Resim silinemez")
          }
        }
  };

  return (
    <Grid stackable>
      <Grid.Row>
      <Grid.Column>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={activityForm}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <label>Aktivite Başlığı*</label>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activityForm.title}
                  component={TextInput}
                />
                  <OnChange name="title">
                {(value, previous) => {
                      setActivityForm({...activityForm,title: value});
                }}
                 </OnChange>
                 <label>Aktivite Liste Fotoğrafı*</label>
                 {
                   activityForm.mainImage && !imageChange ?
                   <Segment>
                    <Image src={activityForm.mainImage.url} style={{width:'50%', height:"auto", marginBottom:"20px", overflow:'hidden'}}/>
                    <Label color="red" style={{marginBottom:"20px", marginRight:"20px", cursor:"pointer"}} 
                 onClick={()=>{setImageDeleted(true); setImageChange(true)}}>Değiştir/Sil <Icon name="trash"></Icon></Label>
                  </Segment>
                :
                files.length === 0 ? 
                <div style={{marginBottom:15}}>
                <PhotoWidgetDropzone setFiles={setFiles} />
                </div>
                :
               (
                <Grid style={{marginTop:"10px"}}>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper setImageDeleted={setImageDeleted} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={225/112}/>
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
                  <label>Açıklama*</label>
                  <Field
                  name="description"
                  component={WYSIWYGEditor}
                  value={activityDesc}
                />
                  <OnChange name="description">
                {(value, previous) => {
                      setActivityDesc(value);
                }}
                 </OnChange>
                <label>Kategori*</label>
                 <Field
                  name="categoryIds"
                  placeholder="Kategori"
                  value={activityForm.categoryIds}
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
                  value={activityForm.subCategoryIds}
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
                  value={activityForm.levelIds}
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
                  value={activityForm.attendancyLimit}
                  width={4}
                />
                 <OnChange name="attendancyLimit">
                {(value, previous) => {
                    if(value !== activityForm.attendancyLimit)
                    {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,attendancyLimit: value});
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
                   <OnChange name="online">
                {(value, previous) => {
                    if(value !== activityForm.online)
                    {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,online: value});
                    }
                }}
                </OnChange>
                </div>
                <OnChange name="online">
                {(value, previous) => {
                    if(value !== activityForm.online)
                    {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,online: value});
                    }
                }}
                </OnChange>
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    date={true}
                    placeholder="Date"
                    value={activityForm.date}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleDateChange}
                  />
                  <Field
                    name="time"
                    time={true}
                    placeholder="Time"
                    value={activityForm.time}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleTimeChange}

                  />
                </Form.Group>
                <label>Fiyat(TL)*</label>
                <Field
                  name="price"
                  component="input"
                  type="number"
                  value={activityForm.price}
                  placeholder="0.00₺"
                  style={{marginBottom:15}}
                />
                 <OnChange name="price">
                {(value, previous) => {
                    if(value !== activityForm.price)
                    {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,price: value});
                    }
                }}
                </OnChange>
                <label>Şehir</label>
                <Field 
                  name="cityId"
                  placeholder="City"
                  component={DropdownInput}
                  options={cities}
                  value={activityForm.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
                <label>Mekan</label>
                <Field
                  name="venue"
                  placeholder="Örn: Mac Fit Balçova"
                  value={activityForm.venue}
                  component={TextInput}
                  style={{marginBottom:15}}
                />
                    <OnChange name="venue">
                {(value, previous) => {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,venue: value});
                }}
                </OnChange>
                <label>Adres</label>
                 <Field
                  name="address"
                  placeholder="Açık adres"
                  value={activityForm.address}
                  component={TextAreaInput}
                  rows={2}
                />
                       <OnChange name="address">
                {(value, previous) => {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,address: value});
                }}
                </OnChange>
                <Button
                  loading={submitting}
                  disabled={loading || invalid || !updateEnabled}
                  floated="right"
                  positive
                  type="submit"
                  content="Kaydet"
                />
                <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="İptal"
                  onClick={
                    activityForm.id
                      ? () => history.push(`/activities/${activityForm.id}`)
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
       {/*<Grid.Row>
      <Grid.Column width={16}>
        <Segment>
          <ActivityFormMap /> 
        <ActivitySearchPage />
        </Segment>
        </Grid.Column>
      </Grid.Row> */}
    </Grid>
  );
};

export default observer(ActivityForm);
