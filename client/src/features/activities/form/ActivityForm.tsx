import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Icon, Popup, Container } from "semantic-ui-react";
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
import { action } from "mobx";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import PhotoGallery from "./PhotoGallery";
import { ActivityPhoto, IPhoto } from "../../../app/models/profile";


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

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })


  const customCityRequired = activityForm.online ? 
  isRequired({message:""}):
  isRequired({message: 'Online olmayan aktiviteler için zorunlu alandır.'}) 

const validate = combineValidators({
  title: isRequired({message: 'Aktivite başlığı zorunlu alandır.'}),
  categoryIds: isRequired({message: 'Kategori zorunlu alandır.'}),
  description: composeValidators(
    isRequired({message: 'Açıklama zorunlu alandır.'}),
    hasLengthGreaterThan(50)({message: 'Açıklama en az 50 karakter uzunluğunda olmalıdır.'})
  )(),
  date: isRequired({message: 'Başlangıç Tarihi zorunlu alandır.'}),
  time:isRequired({message: 'Başlangıç Saati zorunlu alandır.'}),
  endDate: isRequired({message: 'Bitiş Tarihi zorunlu alandır.'}),
  endTime:isRequired({message: 'Bitiş Saati zorunlu alandır.'}),
  price:isRequired('price'),
  cityId: customCityRequired,
  venue:customCityRequired,
  address: customCityRequired
})


  const {allCategoriesOptionList} = rootStore.categoryStore;
  let categoryOptions: ICategory[] = [];
  let subCategoryOptionFilteredList: ICategory[] = [];

  const [docs, setDocs] = useState<any[]>([]);
  const [filedocs, setFileDocs] = useState<any[]>([]);

  const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

   const [category, setCategory] = useState<string[]>([]);
   const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

   const [durationMessage, setDurationMessage] = useState("");

   const [image, setImage] = useState<Blob | null>(null);
   const [imageDeleted, setImageDeleted] = useState(false);
   const [newMainId, setNewMainId] = useState("");


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
  const dateAndTime = activityForm.date ? combineDateAndTime(activityForm.date, time) : combineDateAndTime(new Date(), time);
  setActivityForm({...activityForm, time: dateAndTime});
}

const handleEndDateChange = (endDate:any) =>{

  const dateAndTime = activityForm.endTime ? combineDateAndTime(endDate, activityForm.endTime): combineDateAndTime(endDate, new Date());
  setActivityForm({...activityForm, endDate: dateAndTime});
}

const handleEndTimeChange = (endTime:any) =>{
  const dateAndTime = activityForm.endDate ? combineDateAndTime(activityForm.endDate, endTime) : combineDateAndTime(new Date(), endTime);
  setActivityForm({...activityForm, endTime: dateAndTime});
}


useEffect(() => {
  if(docs.length > 0)
  docs.forEach(doc => {
    uploadedNewImage(doc)
  });
 
  
}, [docs])


const deleteActivityPhoto = (photo:IPhoto) =>{

  if(photo.id !== "")
  { 
    let deleteds = activityForm.deletedPhotos;
    deleteds.push(photo.id);
      setActivityForm({...activityForm, deletedPhotos:deleteds});
      //galery görünümde gösterdiklerimiz
      
      let restPhotos = activityForm.photos!.filter(x => x.id !== photo.id);
      setActivityForm({...activityForm, photos:restPhotos});

  }else{
    debugger;
    let restNews =  activityForm.newphotos.filter(x => x.url !== photo.url );
    setActivityForm({...activityForm, newphotos:restNews});

    let restPhotos = activityForm.photos!.filter(x => x.url !== photo.url);
      setActivityForm({...activityForm, photos:restPhotos});
  }
}

const makeCoverPic = (photo:IPhoto) =>{
  if(photo.id === "")
  { 
     toast.error("Önce değişiklikleri kaydetmelisiniz.")
  }else{
    setNewMainId(photo.id);
    setActivityForm({...activityForm, mainPhotoId:photo.id});
  }
}

const uploadedNewImage = (file:any) =>{
  debugger;

  var reader = new FileReader();
  var url = reader.readAsDataURL(file);//original blob data dönüyor

   reader.onloadend = function (e:any) { //okuma işlemi bitince file update ediliyor preview data ile.
      console.log(reader.result)//blob var

      //yeni eklenen fotolar backend'e giden
      let photos = activityForm.newphotos;
      photos.push(file);
      setActivityForm({...activityForm, newphotos:photos});

      //galery görünümde gösterdiklerimiz
      let existingPhotos = activityForm.photos;
      existingPhotos!.push(new ActivityPhoto(file))
      setActivityForm({...activityForm, photos:existingPhotos});

    }; 
}

  const handleFinalFormSubmit = (values: any) => {
debugger;
    console.log(docs);
    console.log(filedocs)

    let error = false;
    debugger;
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const enddateAndTime = combineDateAndTime(values.endDate, values.endTime);

    const { date, time, endDate, endTime,durationHour,durationDay, durationMin, ...activity } = values;
    activity.date = dateAndTime;
    activity.endDate = enddateAndTime;

   const totalDuration = +((durationDay ? durationDay : 0) *24 *60) + +((durationHour ? durationHour : 0) * 60) + +(durationMin ? durationMin : 0);
   if(totalDuration === 0) {
     setDurationMessage("Lütfen aktivitenin süresini belirtiniz.");
     error = true;
    }
   else {
     setDurationMessage("");
     error = false;
    }
      if(!error)
      {
        if (!activity.id) {
          
            if(activityForm.photos!.length === 0)
            {
              setImageDeleted(true);
              toast.warning("Resim silinemez/ boş geçilemez.")

            }else{
              let newActivity = {
                ...activity,
                id: uuid(),
                duration:totalDuration
              };
              createActivity(newActivity);
            }
          //
        } else {
          debugger;
          if(activityForm.photos!.length !== 0)
          {
            let editedActivity = {
              ...activity,
              duration:totalDuration
            }
            editActivity(editedActivity);
          
          }else 
          {
            setImageDeleted(true);
              toast.warning("Resim silinemez/ boş geçilemez.")
          }
        

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
                    <div style={{margin:"10px 0 30px  0"}}>
                    <PhotoGallery docs={activityForm.photos} setDocuments={setDocs} setFiles={setFileDocs} setUpdateEnabled={setUpdateEnabled}
                    deleteActivityPhoto={deleteActivityPhoto} makeCoverPic={makeCoverPic} newMainId={newMainId}/>
                    </div>
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
                  width={isMobile ? 6 :3}
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
                <Form.Group className="date_equal_fields" widths="equal">
                <Form.Group widths="equal">
                  <Field
                    label="Başlangıç Tarihi*"
                    name="date"
                    date={true}
                    placeholder="Seçiniz"
                    value={activityForm.date}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleDateChange}
                  />
                  <Field
                    label="Başlangıç Saati*"
                    name="time"
                    time={true}
                    placeholder="Seçiniz"
                    value={activityForm.time}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleTimeChange}

                  />
                </Form.Group>

                
                <Form.Group widths="equal">
                  <Field
                    label="Bitiş Tarihi*"
                    name="endDate"
                    date={true}
                    placeholder="Seçiniz"
                    value={activityForm.endDate}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleEndDateChange}
                  />
                  <Field
                    label="Bitiş Saati*"
                    name="endTime"
                    time={true}
                    placeholder="Seçiniz"
                    value={activityForm.endTime}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                    onChange={handleEndTimeChange}

                  />
                </Form.Group>
                </Form.Group>


                <label id="durationLabel" className={durationMessage !== "" ? "customErrorLabel fieldLabel" :"fieldLabel"} >Etkinlik Süresi* 
                <Popup 
                    hoverable
                    on={['hover', 'click']}
                    positionFixed 
                    size='large' 
                    trigger={<Icon style={{cursor:"pointer", marginLeft:"5px"}} 
                    name="info circle" />}>
                      <Popup.Content>
                        <div style={{fontSize:"14px"}}>Etkinliğin toplam süresi.</div>
                      </Popup.Content>
                    </Popup>
                    </label>
                    <div style={{display:"flex", flexDirection:"row", marginBottom:"15px", }}>
                      <div className="durationItems">
                      <span>Gün:</span>
                        <Field
                      name="durationDay"
                      component={NumberInput}
                      value={activityForm.durationDay}
                      placeholder="00"
                      labelName="durationLabel"
                      // width={isMobile? 4 : 5}
                      type="number"
                    />
                    <OnChange name="durationDay">
                    {(value, previous) => {
                        if(value !== activityForm.durationDay)
                        {
                            setUpdateEnabled(true);
                            setActivityForm({...activityForm,durationDay: value});
                        }
                    }}
                    </OnChange>
                      </div>
                   <div className="durationItems">
                   <span> Saat:</span>
                   <Field
                  name="durationHour"
                  component={NumberInput}
                  value={activityForm.durationHour}
                  placeholder="00"
                  labelName="durationLabel"
                 // width={isMobile? 4 : 5}
                  type="number"
                   style={{marginBottom:15}}
                />
                 <OnChange name="durationHour">
                {(value, previous) => {
                    if(value !== activityForm.durationHour)
                    {
                        setUpdateEnabled(true);
                        setActivityForm({...activityForm,durationHour: value});
                    }
                }}
                </OnChange>
                   </div>
                   <div className="durationItems">
                   <span> Dakika:</span>
                    <Field
                      name="durationMin"
                      component={NumberInput}
                      value={activityForm.durationMin}
                      placeholder="00"
                      labelName="durationLabel"
                      // width={isMobile? 4 : 5}
                      type="number"
                      
                    />
                    <OnChange name="durationMin">
                    {(value, previous) => {
                        if(value !== activityForm.durationMin)
                        {
                            setUpdateEnabled(true);
                            setActivityForm({...activityForm,durationMin: value});
                        }
                    }}
                    </OnChange>
                   </div>
                  
                    </div>
                    {durationMessage!=="" && <label style={{color:"red"}}>*{durationMessage}</label>}            

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
                  width={isMobile ? 6 :3}
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
                    width={isMobile ? 6 :3}
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
                  width={isMobile ? 6 :3}
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
