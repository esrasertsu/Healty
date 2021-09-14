import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon, Grid, Modal, Step } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import NumberInput from '../../../app/common/form/NumberInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { IActivity, IPaymentCardInfo, IPaymentUserInfoDetails, PaymentUserInfoDetails } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import tr  from 'date-fns/locale/tr'
import { format } from 'date-fns';
import { action } from 'mobx';
import DropdownInput from '../../../app/common/form/DropdownInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import TextInput from '../../../app/common/form/TextInput';
import PhoneNumberInput from '../../../app/common/form/PhoneNumberInput';
import { useMediaQuery } from 'react-responsive'
import { isValidPhoneNumber } from 'react-phone-number-input'
import ActivityPaymentStarterPage from './ActivityPaymentStarterPage';

interface DetailParams{
    id:string,
    count:string
}

interface IProps extends RouteComponentProps<DetailParams> {}


 const ActivityPaymentPage: React.FC<IProps> = ({match}) => {

  const rootStore = useContext(RootStoreContext);
  const {getActivityPaymentPage,setActivityUserPaymentInfo,activityUserPaymentInfo,getIyzicoPaymentPage,
    processPayment} = rootStore.activityStore;
  const {
    cities
  } = rootStore.commonStore;

  const [count, setCount] = useState(1);  
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
      debugger;
      getActivityPaymentPage(Number(match.params.count),match.params.id) 
      .then(action((res) => {
      debugger;
      setActivityUserPaymentInfo(new PaymentUserInfoDetails(res!));
    }))
    .finally(() => setLoading(false));
  }
  }, [match.params.id,getActivityPaymentPage])

  

  const handleFinalFormSubmit = (values: IPaymentUserInfoDetails) => {

    setLoading(true);
    debugger;
    getIyzicoPaymentPage(values).then(action((res) => {
      debugger;
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
    debugger;
    processPayment(values).then(action(() => {
      debugger;
   
    setShowPaymentPage(true);
    setStepNo(1);
    setStep0Completed(true);
    setShowUserPaymentInfoPage(false);
  
  }))
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
    <Fragment>
   <Step.Group style={{marginTop:"30px", width:"100%"}}>
    <Step onClick={() => handleStepClick(0)} active={stepNo === 0}>
      <Icon name='user' />
      <Step.Content>
        <Step.Title>Üye Bilgileri</Step.Title>
        <Step.Description>Profil bilgilerini düzenle</Step.Description>
      </Step.Content>
    </Step>

    <Step  active={stepNo === 1} disabled={showPaymentPage === false}>
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
     <Grid stackable>
      <Grid.Row>
      <Grid.Column>
        <Segment clearing>
          <FinalForm
           // validate = {validate}
            initialValues={activityUserPaymentInfo}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading} style={{margin:"2.5rem"}}>
                  <Form.Group widths="equal" className="creditCard" style={{width:"60%"}}>
                    <div className="equalUserInfoField">
                    <label>Ad*</label>
                  <Field
                  name="name"
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
                <label>Soyad*</label>
                  <Field
                  name="surname"
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

                  <label>Telefon Numarası*</label>
                <Field
                  name="gsmNumber"
                  placeholder="Telefon Numarası"
                  component={PhoneNumberInput}
                  value={activityUserPaymentInfo.gsmNumber}
                /> 
                    <OnChange name="gsmNumber">
                {(value, previous) => {
                       // setUpdateEnabled(true);
                        setActivityUserPaymentInfo({...activityUserPaymentInfo,gsmNumber: value});
                }}
                </OnChange>
                  <label>Adres</label>
                 <Field
                  name="address"
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
                <label>Şehir</label>
                <Field 
                  name="cityId"
                  placeholder="Şehir"
                  component={DropdownInput}
                  options={cities}
                  value={activityUserPaymentInfo.cityId}
                  clearable={true}
                  onChange={(e: any,data: any)=>handleCityChanged(e,data)}
                  style={{marginBottom:15}}
                />
            
         
              
                <Button
                  //loading={submitting}
                  disabled={loading || invalid }
                  floated="right"
                  positive
                  type="submit"
                >Kaydet ve Devam et <Icon style={{opacity:"1", marginLeft:"5px"}} name="angle right"></Icon></Button>
                {/* <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="İptal"
                  onClick={
                    activityForm.id
                      ? () => history.push(`/activities/${activityForm.id}`)
                      : () => history.push("/activities")
                  }
                /> */}
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
   }  
   {showPaymentPage && 
   (
     <>
         
      <ActivityPaymentStarterPage handlePaymentFormSubmit={handlePaymentFormSubmit} activityId={match.params.id} count={match.params.count} />
   
     </>
   )
   

   }
    
   </Fragment>
    )
}

export default observer(ActivityPaymentPage);