import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Label, Header, Image, Icon, Popup, Container } from "semantic-ui-react";
import {
  ActivityFormValues
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


interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
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



  const customCityRequired = activityForm.online ? 
  isRequired({message:""}):
  isRequired({message: 'Şehir zorunlu alandır.'}) 

const validate = combineValidators({
  title: isRequired({message: 'Aktivite başlığı zorunlu alandır.'}),
  categoryIds: isRequired({message: 'Kategori zorunlu alandır.'}),
  description: composeValidators(
    isRequired({message: 'Açıklama zorunlu alandır.'}),
    hasLengthGreaterThan(50)({message: 'Açıklama en az 50 karakter uzunluğunda olmalıdır.'})
  )(),
  date: isRequired({message: 'Tarih zorunlu alandır.'}),
  time:isRequired({message: 'Saat zorunlu alandır.'}),
  price:isRequired('price'),
  cityId: customCityRequired
})


  const {allCategoriesOptionList} = rootStore.categoryStore;
  let categoryOptions: ICategory[] = [];
  let subCategoryOptionFilteredList: ICategory[] = [];

  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

   const [category, setCategory] = useState<string[]>([]);
   const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

   const [files, setFiles] = useState<any[]>([]);
   const [originalImage, setOriginalImage] = useState<Blob | null>(null);

   const [image, setImage] = useState<Blob | null>(null);
   const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
   const [imageChange, setImageChange] = useState(false);
   const [imageDeleted, setImageDeleted] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(action((activity) => {
          setActivityForm(new ActivityFormValues(activity!));
          if(activity.mainImage===undefined)
          {
            setImageDeleted(true);
          }
        }))
        .finally(() =>
         setLoading(false));
    }else{
        setImageDeleted(true);
    }
    loadLevels();

    return () => {
      setActivityForm(new ActivityFormValues());
    }
  }, [loadActivity,match.params.id]);

  const handleCategoryChanged = (e: any, data: string[]) => {
    setActivityForm({...activityForm, categoryIds: [...data]});
    setCategory(data);  
  
 }

 const handleSubCategoryChanged = (e: any, data: string[]) => {  
     setActivityForm({...activityForm,subCategoryIds: [...data]});
   }

   const handleCityChanged = (e: any, data: string) => {  
    if((activityForm.cityId !== data))
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
      allCategoriesOptionList.filter(x=> activityForm.categoryIds.findIndex(y=> y === x.parentId!) > -1).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      const renewedSubIds = activityForm.subCategoryIds.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setActivityForm({...activityForm,subCategoryIds: [...renewedSubIds]});

   }
        useEffect(() => {
            loadSubCatOptions();
        }, [category,allCategoriesOptionList]);
      
   
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
          debugger;
            if(image == null)
            {
              setImageDeleted(true);
            }else{
              let newActivity = {
                ...activity,
                photo: image,
                id: uuid(),
              };
              createActivity(newActivity);
            }
          //
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
              toast.warning("Resim silinemez/ boş geçilemez.")
          }
        

}
    
  };

  return (
    <Container className="pageContainer">

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
                <label id="activityName" 
              //  className={activityForm.title === "" ? "customErrorLabel" :""}
                >Aktivite Başlığı*</label>
                <Field
                  labelName="activityName"
                  name="title"
                  placeholder="Title"
                  value={activityForm.title}
                  component={TextInput}
                />
                  <OnChange name="title">
                {(value, previous) => {
                  debugger;
                      setActivityForm({...activityForm,title: value});
                }}
                 </OnChange>
                 <label className={ activityForm.mainImage === null || imageDeleted ? "errorLabel" : ""}>Aktivite Liste Fotoğrafı*</label>
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
                  <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChange} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} aspect={278/174} maxHeight={174}/>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                  </Grid.Column>

                  <Grid.Column width="eight">
                  <div style={{display:"flex"}}>
                  <Label style={{marginBottom:"20px", marginRight:"20px", cursor:"pointer"}} 
                  onClick={()=> {setFiles([]);setImageDeleted(true); setImage(null)}}>Sil  <Icon name="trash"></Icon></Label>
                  {/* <Label style={{marginBottom:"20px", cursor:"pointer"}} onClick={()=> {
                  setImageChange(false); setImageDeleted(false); setFiles([])}}>Değişiklikleri geri al <Icon name="backward"></Icon> </Label>    */}
                  </div>             
                  </Grid.Column>
               </Grid>
               )
         }    
                  <label  className={activityForm.description === "" ? "customErrorLabel" :""} id="activityDesc">Açıklama* 
                  <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin detaylı açıklaması. Min 50 karakter uzunluğunda olmalıdır.</div>
                      </Popup.Content>
                    </Popup>
                    </label>
                  <Field
                  labelName="activityDesc"
                  name="description"
                  component={WYSIWYGEditor}
                  value={activityForm.description}
                />
                  <OnChange name="description">
                {(value, previous) => {
                  setActivityForm({...activityForm,description: value});
                }}
                 </OnChange>
                <label id="activityCat">Kategori*
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin kategori bilgisi. Birden fazla seçilebilir.</div>
                      </Popup.Content>
                    </Popup>
                    </label>
                 <Field
                  labelName="activityCat"
                  name="categoryIds"
                  placeholder="Kategori"
                  value={activityForm.categoryIds}
                  component={DropdownMultiple}
                  emptyError={activityForm.categoryIds}
                  options = {categoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleCategoryChanged(e,data)}
                    }
                /> 
                 <label id="activitySubCat">Branşlar*
                 <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin alt kategori/branş bilgisi. Kategori seçiminden sonra gelmektedir. Birden fazla seçilebilir.</div>
                      </Popup.Content>
                    </Popup>
                    </label>        
                 <Field
                  labelName="activitySubCat"
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={activityForm.subCategoryIds}
                  component={DropdownMultiple}
                  emptyError={activityForm.subCategoryIds}
                  options={subCategoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      handleSubCategoryChanged(e,data)}}
                />  
                 <label id="actvityLevel">Seviye*
                 <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin seviye bilgisi. Birden fazla seçilebilir.</div>
                      </Popup.Content>
                    </Popup>
                    </label>
                <Field
                clearable
                labelName="actvityLevel"
                  name="levelIds"
                  placeholder="Seviye"
                  value={activityForm.levelIds}
                  component={DropdownMultiple}
                  emptyError={activityForm.levelIds}
                  options={levelList}
                  onChange={(e: any,data:any)=>
                    {
                      handleLevelChanged(e,data)}}
                /> 
                <>
              <label>Katılımcı Sınırı 
                <Popup 
                hoverable
                on={['hover', 'click']}
                positionFixed 
                size='large' 
                trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                name="info circle" />}>
                  <Popup.Content>
                    <div style={{fontSize:"14px"}}>Etkinliğe katılabilecek max kişi sayısıdır. Boş bırakıldığı takdirde sınırsız katılımcı olarak değerlendirilmektedir.</div>
                  </Popup.Content>
                </Popup>
              </label>
              </>
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
                   <span>Online katılma açık
                   <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin online olması veya online katılıma açık olması durumunda işaretlenmelidir.</div>
                      </Popup.Content>
                    </Popup>
                </span> 
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
              
                <Form.Group widths="equal">
                  <Field
                    label="Tarih*"
                    name="date"
                    date={true}
                    placeholder="Tarih"
                    value={activityForm.date}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleDateChange}
                  />
                  <Field
                    label="Saat*"
                    name="time"
                    time={true}
                    placeholder="Saat"
                    value={activityForm.time}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleTimeChange}

                  />
                </Form.Group>
                <label id="priceLabel" className={activityForm.price === undefined ? "customErrorLabel fieldLabel" :"fieldLabel"} >Fiyat(TL)* 
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin herşey dahil ücreti(KDV, site komisyonu vs). Ücretsiz aktiviteler için 0 (sıfır) giriniz.</div>
                      </Popup.Content>
                    </Popup>
                    </label>
                <Field
                  name="price"
                  component={NumberInput}
                  value={activityForm.price}
                  placeholder="500TL"
                  labelName="priceLabel"
                  type="number"
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
                <label id="cityLabel">Şehir
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin gerçekleşeceği şehir bilgisi. Online aktivite değilse girilmesi zorunludur.</div>
                      </Popup.Content>
                    </Popup>
                </label>
                <Field 
                  labelName="cityLabel"
                  name="cityId"
                  placeholder="Şehir"
                  component={DropdownInput}
                  options={cities}
                  value={activityForm.cityId}
                  emptyError={activityForm.cityId}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
                <label>Mekan
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin gerçekleşeceği lokasyon/mekan bilgisi. Online aktivite değilse girilmesi zorunludur.</div>
                      </Popup.Content>
                    </Popup>
                </label>
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
                <label>Adres
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Aktivitenin gerçekleşeceği adres bilgisi. Kullanıcıların lokasyonu bulabilmesi için detaylandırılmalıdır. Online aktivite değilse girilmesi beklenmektedir.</div>
                      </Popup.Content>
                    </Popup>
                </label>
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
                  disabled={loading}
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
     
       </Grid.Row>
    
    </Grid>
 </Container>
  );
};

export default observer(ActivityForm);
