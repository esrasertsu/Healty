import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment,  Form, Button,Icon, Grid,  Step,  Container, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import {  RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {  IPaymentCardInfo, IPaymentUserInfoDetails, PaymentUserInfoDetails } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import { action } from 'mobx';
import DropdownInput from '../../../app/common/form/DropdownInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import TextInput from '../../../app/common/form/TextInput';
import PhoneNumberInput from '../../../app/common/form/PhoneNumberInput';
import { useMediaQuery } from 'react-responsive'
import { isValidPhoneNumber } from 'react-phone-number-input'
import ActivityPaymentStarterPage from './ActivityPaymentStarterPage';
import { combineValidators, isRequired } from 'revalidate';
import { history } from '../../..';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { toast } from 'react-toastify';
import dompurify from 'dompurify';
import { JSDOM } from 'jsdom'
import queryString from 'query-string';

interface DetailParams{
    id:string,
    count:string
}

interface IProps extends RouteComponentProps<DetailParams> {}

const validate = combineValidators({
  name: isRequired({message: 'Ad zorunlu alandır.'}),
  surname: isRequired({message: 'Soyad zorunlu alandır.'}),
  gsmNumber: isRequired({message: 'Telefon numarası zorunlu alandır.'}),
  cityId: isRequired({message:'Şehir seçimi zorunlu alandır.'}),
  address: isRequired({message:'Adres zorunlu alandır.'})
})

 const ActivityPaymentPage: React.FC<IProps> = ({match,location}) => {

  const rootStore = useContext(RootStoreContext);
  const {getActivityPaymentPage,setActivityUserPaymentInfo,activityUserPaymentInfo,getUserPaymentDetailedInfo,
    processPayment, loadActivity, loadingActivity,activity} = rootStore.activityStore;
  const {
    cities
  } = rootStore.commonStore;

  const {
    openModal,closeModal,modal
  } = rootStore.modalStore;

  const [loading, setLoading] = useState(false);
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [stepNo, setStepNo] = useState(0);  

    const[step1Completed, setStep1Completed] = useState(false);
    const[step0Completed, setStep0Completed] = useState(false);
    const[showInfo, setShowInfo] = useState(false);
    const[showPaymentPage, setShowPaymentPage] = useState(false);
    const[showUserPaymentInfoPage, setShowUserPaymentInfoPage] = useState(true);



    useEffect(() => {
    if (match.params.id) {

      setLoading(true);
      getActivityPaymentPage(Number(match.params.count),match.params.id) 
      .then(action((res) => {
      setActivityUserPaymentInfo(new PaymentUserInfoDetails(res!));
    }))
    .finally(() => setLoading(false));
  }
  }, [match.params.id,getActivityPaymentPage])


  useEffect(() => {
    loadActivity(match.params.id);
}, [loadActivity, match.params.id]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

if(loadingActivity) return <LoadingComponent content='Loading...'/>  

  

  const handleFinalFormSubmit = (values: IPaymentUserInfoDetails) => {

    setLoading(true);
    getUserPaymentDetailedInfo(values).then(action((res) => {
   if(res! === true)
   { 
     setShowPaymentPage(true);
    setStepNo(1);
    setStep0Completed(true);
    setShowUserPaymentInfoPage(false);

   }
   
  
  }))
  .finally(() => setLoading(false));
  }


  const handlePaymentFormSubmit = (values: IPaymentCardInfo) => {

    setLoading(true);
    processPayment(values).then((res) => {
  if(res)
  {
    if(res.status === false)
    {
      setLoading(false);
      toast.error("3D ödeme sayfası başlatılamıyor. Formu gözden geçirip tekrar deneyin. Sorun devam ederse site yöneticisiyle ilteşime geçin.")
    }else {

      setLoading(false);

      var newDoc = document.open("text/html", "replace");
      newDoc.write(res.contentHtml);
      newDoc.close();
    }
  }
  setLoading(false);

    
  
  })
  .finally(() => setLoading(false));
  }

  const handleStepClick = (value: number) => {
    if(value === 1 && step0Completed)
    {
      setStepNo(value);
      setShowUserPaymentInfoPage(false);
      setShowPaymentPage(true);
    }
    if(value === 0)
    {
      setStepNo(value);
      setShowPaymentPage(false);
      setShowUserPaymentInfoPage(true);
    }
  }

  const handleCityChanged = (e: any, data: string) => {  
    if((activityUserPaymentInfo.cityId !== data))
    setActivityUserPaymentInfo({...activityUserPaymentInfo,cityId: data});
    
 }
    return (
      <Container className="pageContainer">
      <Step.Group style={{marginTop:"30px", width:"100%"}} >
    <Step onClick={() => handleStepClick(0)} active={stepNo === 0}>
      <Icon name='user' />
      <Step.Content>
        <Step.Title>Üye Bilgileri</Step.Title>
        <Step.Description>Profil bilgilerini düzenle</Step.Description>
      </Step.Content>
    </Step>

    <Step active={stepNo === 1} disabled={showPaymentPage === false}>
      <Icon name='payment' />
      <Step.Content>
        <Step.Title>Ödeme</Step.Title>
        <Step.Description>Kredi kartı bilgileri</Step.Description>
      </Step.Content>
    </Step>

    <Step active={stepNo === 2} disabled={showInfo === false}>
      <Icon name='info' />
      <Step.Content>
        <Step.Title>Onay</Step.Title>
        <Step.Description>Ödeme onayı bilgilendirme</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
{showUserPaymentInfoPage &&  
     <Grid stackable style={{marginBottom:"50px"}}>
     
      <Grid.Row>
      <Grid.Column width={!isTablet ? 12 : 11}>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={activityUserPaymentInfo}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading} style={{margin:"2.5rem"}}>
                  <Form.Group widths="equal" className="creditCard" style={isMobile ? {width:"100%"} :{width:"60%"}}>
                    <div className="equalUserInfoField">
                    <label id="nameLabel">Ad*</label>
                  <Field
                  name="name"
                  labelName="nameLabel"
                  placeholder="Ad"
                  value={activityUserPaymentInfo.name}
                  component={TextInput}
                />
                   <OnChange name="name">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                        setActivityUserPaymentInfo({...activityUserPaymentInfo,name: value});
                }}
                </OnChange>
                    </div>
                    <div className="equalUserInfoField">
                <label id="surnameLabel">Soyad*</label>
                  <Field
                  name="surname"
                  labelName="surnameLabel"
                  placeholder="Soyad"
                  value={activityUserPaymentInfo.surname}
                  component={TextInput}
                />
                   <OnChange name="surname">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                        setActivityUserPaymentInfo({...activityUserPaymentInfo,surname: value});
                }}
                </OnChange>
                </div>
                </Form.Group>

                <label id="gsmNumber_label">Telefon Numarası*</label>
                <Field
                  width={isMobile ? "16" :"4"}
                  name="gsmNumber"
                  labelName="gsmNumber_label"
                  placeholder="Telefon Numarası"
                  component={PhoneNumberInput}
                  value={activityUserPaymentInfo.gsmNumber}
                /> 
                <OnChange name="gsmNumber">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                       debugger;
                        setActivityUserPaymentInfo({...activityUserPaymentInfo,gsmNumber: value});
                      
                }}
                </OnChange>
                  <label id="adresLabel">Adres*</label>
                 <Field
                  name="address"
                  labelName="adresLabel"
                  placeholder="Açık adres"
                  value={activityUserPaymentInfo.address}
                  component={TextAreaInput}
                  rows={2}
                />
                       <OnChange name="address">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                        setActivityUserPaymentInfo({...activityUserPaymentInfo,address: value});
                }}
                </OnChange>
                <label id="cityLabel">Şehir*</label>
                <Field 
                  name="cityId"
                  labelName="cityLabel"
                  placeholder="Şehir"
                  component={DropdownInput}
                  options={cities}
                  value={activityUserPaymentInfo.cityId}
                  clearable={true}
                  emptyError={activityUserPaymentInfo.cityId}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                  width={isMobile ? "16" :"4"}
                />
            
         
              
                <Button
                  loading={loading}
                  disabled={loading || invalid }
                  floated="right"
                  positive
                  fluid={isMobile}
                  type="submit"
                  style={{margin:"20px 0"}}
                >Kaydet ve Devam et <Icon style={{opacity:"1", marginLeft:"5px"}} name="angle right"></Icon></Button>
                { <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="İptal"
                  onClick={
                    match.params.id
                      ? () => history.push(`/activities/${match.params.id}`)
                      : () => history.push("/activities")
                  }
                />}
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
      <Grid.Column width={!isTablet ? 4 : 5}>
    <Segment>
    <Container>
      {
        activity && (
          <>
          <div className="activity_paymentpage_price_containerdiv">
            <div className="activity_paymentpage_price_header" style={{marginBottom:"20px"}}>Ödenecek Tutar</div>
            <div className="activity_paymentpage_price_items"><span>Aktivite fiyatı</span> <span>{activity.price} TL</span> </div>
            <div className="activity_paymentpage_price_items"><span>Kişi sayısı</span> <span>{match.params.count}</span> </div>
            <div className="activity_paymentpage_price_items"><span>İndirim</span> <span>0 TL</span> </div>
          
            <div className="activityDetail_payment_footer activity_paymentpage_price_footer">
                <div style={{fontSize:"18px"}}>Toplam </div> 
                <div className="price">{activity.price! * Number(match.params.count)} TL</div>
            </div>
            <div>
            {/* <Button size="large" positive fluid  floated="right" style={{marginTop:"20px"}}
                  type="submit" onClick={onSubmit} disabled={!paymentContract || !iyzicoContract}>
                Ödemeyi Tamamla <Icon style={{opacity:"1", marginLeft:"5px"}} name="thumbs up"></Icon>
              </Button> */}
            </div>
          </div>
 
          </>
        )
      }
      
       </Container>
    </Segment>
    </Grid.Column>
       </Grid.Row>
      
    </Grid>
   }  
   {showPaymentPage && 
   (
     <>
         
      <ActivityPaymentStarterPage handlePaymentFormSubmit={handlePaymentFormSubmit} activity={activity} count={match.params.count} loading={loading}/>
   
     </>
   )
   

   }
    
   </Container>
    )
}

export default observer(ActivityPaymentPage);