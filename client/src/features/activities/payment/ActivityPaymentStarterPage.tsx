import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon, Container, Grid, Image, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { observer } from 'mobx-react-lite';
import {  IActivity, IPaymentCardInfo, PaymentCardInfo } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import Card from 'react-credit-cards';
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from "../../../app/common/util/util"
import 'react-credit-cards/es/styles-compiled.css';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import Payment from "payment";
import { useMediaQuery } from 'react-responsive'


  interface IProps{
    activity:IActivity | null;
    handlePaymentFormSubmit: (values:any) => void;
    count: string;
    loading: boolean;
  }

 const ActivityPaymentStarterPage:React.FC<IProps> = ({handlePaymentFormSubmit,activity, count,loading}) =>  {

  const rootStore = useContext(RootStoreContext);
  const [focused, setFocused] = useState("");
  const [cvc, setCVC] = useState("");
  const [cardExpire, setCardExpire] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [exMonth,setExMonth] = useState("");
  const [exYear,setExYear] = useState("");

  const [paymentInfo, setPaymentInfo] = useState<IPaymentCardInfo>(new PaymentCardInfo());

  const [cardNoIcon, setCardNoIcon] = useState(false);
  const [expireIcon, setExpireIcon] = useState(false);
  const [cvcIcon, setCvcIcon] = useState(false);

  const [cardNoErrorMessage, setCardNoErrorMessage] = useState(false);
  const [cardNameErrorMessage, setCardNameErrorMessage] = useState(false);

  const [expireErrorMessage, setExpireErrorMessage] = useState(false);
  const [cvcErrorMessage, setCvcErrorMessage] = useState(false);

const [paymentContract, setPaymentContract] = useState(false);
const [iyzicoContract, setIyzicoContract] = useState(false);
const [loading3DPage, setLoading3DPage] = useState(false);
const isTablet = useMediaQuery({ query: '(max-width: 768px)' })

    const { user } = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;

  
  const handleInputFocus = (e:any) => {
    e.stopPropagation();
    setFocused(e.target.name);
  };

  useEffect(() => {
    if(activity)
    setPaymentInfo({...paymentInfo, activityId:activity!.id, ticketCount:Number(count)});

    return () => {
      //cleanup
    }
  }, [activity])

  const onSubmit = async (e:any) => {
    debugger;
    e.stopPropagation();
    e.preventDefault()
;
    let success = true;

    if(!Payment.fns.validateCardNumber(paymentInfo.cardNumber))
    {
      setCardNoErrorMessage(true);
      success = false;
    }
     if(cardName.length < 4)
    {
      setCardNameErrorMessage(true);
      success = false;

    }
     if(!Payment.fns.validateCardExpiry(paymentInfo.expireDate))
    {
      setExpireErrorMessage(true);
      success = false;

    }
   if(!Payment.fns.validateCardCVC(paymentInfo.cvc))
    {
      setCvcErrorMessage(true);
      success = false;
    }
  if(success){

    // setPaymentInfo({...paymentInfo, 
    //    activityId:activity!.id,
    //   expireMonth: exMonth, expireYear: exYear,
    //   ticketCount:Number(count)});
    //setLoading3DPage(true);
    handlePaymentFormSubmit(paymentInfo);

  }
  }

  
  const openIyzicoModal = (e:any) => {
    e.stopPropagation();
    if(modal.open) closeModal();
  
        openModal("Uzman Başvuru Formu", <>
        <Modal.Description>
        <iframe style={{width:"100%", border:"none"}} src="https://www.iyzico.com/pazaryeri-alici-anlasma/" />
        </Modal.Description>
        </>,false,
       "","", false) 
       
  }

  if(loading) return <LoadingComponent content='Sizi 3D Secure Ödeme Sayfasına Aktarıyoruz. Lütfen sayfayı kapatmayınız.'/>  
    

    return (

     <Fragment>
     <Grid stackable style={{marginBottom:"50px"}}>
<Grid.Column width={!isTablet ? 12 : 11}>


         <Segment>

       <FinalForm
      onSubmit={(e) => onSubmit(e)}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        focused
        
      }:any) => {
        return (
          <>
          <Form onSubmit={handleSubmit} loading={loading} style={{margin:"2.5rem 0"}}>
            <div className="paymentFormContainer">
            <div>
            <Card
              number={values.number || ''}
              name={values.name || ''}
              expiry={values.expiry || ''}
              cvc={values.cvc || ''}
              focused={focused}
            />
            </div>
            <div>
            <div className="activity_paymentpage_price_header">Kart Bilgileri</div>

            <label>Kart Numarası* {cardNoIcon && <Icon color="green" name="check" />}  </label>
            <div className="field">
              <Field
                name="number"
                component="input"
                type="tel"
                pattern="[\d| ]{16,22}"
                placeholder="Kart Numarası"
                format={formatCreditCardNumber}
                required
                value={paymentInfo.cardNumber}
                onFocus={handleInputFocus}
              />
            {cardNoErrorMessage && <label style={{color:"red"}}>Geçerli bir kart numarası giriniz</label>}  
               <OnChange name="number">
                {(value, previous) => {
                     setPaymentInfo({...paymentInfo, cardNumber:value});

                    if(Payment.fns.validateCardNumber(value))
                    {
                        setCardNoIcon(true);
                        setCardNoErrorMessage(false);
                      }else {
                        setCardNoIcon(false);
                      }
                }}
                </OnChange> 
            </div>
            <label>Ad Soyad*</label>
            <div  className="field">
              <Field
                name="name"
                component="input"
                type="text"
                placeholder="Ad Soyad"
                value={paymentInfo.cardHolderName}
                onFocus={handleInputFocus}
              />
                 {cardNameErrorMessage &&   <label style={{color:"red"}}>Kart üzerindeki ad/soyad giriniz</label>}            
                <OnChange name="name">
                {(value, previous) => {
                     setCardName(value);
                     setPaymentInfo({...paymentInfo, cardHolderName:value});

                    if(value.length > 5)
                    {
                        setCardNameErrorMessage(false);
                    }
                }}
                </OnChange> 
            </div>
            <div  className="equal width fields creditCard">
              <div className="equalField">
                <label>Son Geçerlilik Tarihi* {expireIcon && <Icon color="green" name="check" />} </label>
              <div  className="field">
                <Field
                  name="expiry"
                  component="input"
                  type="text"
                  pattern="\d\d/\d\d"
                  placeholder="__/__"
                  format={formatExpirationDate}
                  onFocus={handleInputFocus}
                  value={paymentInfo.expireDate}

                />
                {expireErrorMessage &&  <label style={{color:"red"}}>Tarihi geçmiş kart girdiniz</label>}
                 <OnChange name="expiry">
                {(value, previous) => {
                     setCardExpire(value);
                     setPaymentInfo({...paymentInfo, expireDate:value});

                    if(Payment.fns.validateCardExpiry(value))
                    {
                        // setUpdateEnabled(true);
                        setExpireIcon(true);
                        setExpireErrorMessage(false);
                        setPaymentInfo({...paymentInfo, expireDate:value,expireMonth: Payment.fns.cardExpiryVal(value).month.toString(), expireYear: Payment.fns.cardExpiryVal(value).year.toString()});

                        setExMonth(Payment.fns.cardExpiryVal(value).month.toString());
                        setExYear(Payment.fns.cardExpiryVal(value).year.toString());

                      }else{
                        setExpireIcon(false);

                      }
                }}
                </OnChange> 
                </div>
              </div>
              <div className="equalField">
              <label>CVC* {cvcIcon && <Icon color="green" name="check" />}</label>
              <div  className="field">
              <Field
                name="cvc"
                component="input"
                type="text"
                pattern="\d{3,4}"
                placeholder="CVC"
                format={formatCVC}
                onFocus={handleInputFocus}
                value={paymentInfo.cvc}

              />
               {cvcErrorMessage && <label style={{color:"red"}}>Geçerli bir CVC numarası giriniz</label>}
              <OnChange name="cvc">
                {(value, previous) => {
                    setCVC(value);
                    setPaymentInfo({...paymentInfo, cvc:value});

                    if(Payment.fns.validateCardCVC(value))
                    {
                        setCvcIcon(true);
                        setCvcErrorMessage(false);

                      }else {
                        setCvcIcon(false);
                      }
                }}
                </OnChange> 
              </div>
              </div>
            </div>
            <div style={{margin:"50px 0 0 0"}}>
         
                  <Field
                      name="paymentContract"
                      component="input"
                      type="checkbox"
                      width={4}
                      format={v =>v === true}
                      initialValue={paymentInfo.hasSignedPaymentContract}
                      parse={v => (v ? true : false) }
                    />&nbsp;&nbsp;
                   <span><a style={{cursor:"pointer"}}  onClick={openIyzicoModal} >Ön Bilgilendirme Satış Sözleşmesi</a>'ni okudum.</span> 
                    <OnChange name="paymentContract">
                {(value, previous) => {
                        setPaymentInfo({...paymentInfo, hasSignedPaymentContract:value});
                        setPaymentContract(value);
                    
                }}
                </OnChange> 
                   <div style={{marginBottom:15}}>
                  <Field
                      name="hasSignedIyzicoContract"
                      component="input"
                      type="checkbox"
                      initialValue={paymentInfo.hasSignedIyzicoContract}
                      width={4}
                      format={v =>v === true}
                      parse={v => (v ? true : false) }
                    />&nbsp;&nbsp;
                   <span><a style={{cursor:"pointer"}} onClick={openIyzicoModal}>iyzico Platform Kullanım Sözleşmesi</a>'ni onaylıyorum.</span> 
                   <OnChange name="hasSignedIyzicoContract">
                {(value, previous) => {
                    setPaymentInfo({...paymentInfo, hasSignedIyzicoContract:value});
                    setIyzicoContract(value);

                }}
                </OnChange>
                </div>
                </div>
            </div>
            </div>
          </Form>
       
        </>
       )
      
      }}
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
            <div className="activity_paymentpage_price_items"><span>Kişi sayısı</span> <span>{count}</span> </div>
            <div className="activity_paymentpage_price_items"><span>İndirim</span> <span>0 TL</span> </div>
          
            <div className="activityDetail_payment_footer activity_paymentpage_price_footer">
                <div style={{fontSize:"18px"}}>Toplam </div> 
                <div className="price">{activity.price! * Number(count)} TL</div>
            </div>
            <div>
            <Button size="large" positive fluid  floated="right" style={{marginTop:"20px"}}
                  type="submit" onClick={onSubmit} disabled={!paymentContract || !iyzicoContract}>
                Ödemeyi Tamamla <Icon style={{opacity:"1", marginLeft:"5px"}} name="thumbs up"></Icon>
              </Button>
            </div>
          </div>
 
          </>
        )
      }
      
       </Container>
    </Segment>
    </Grid.Column>
    </Grid>
           </Fragment>
    )
}

export default observer(ActivityPaymentStarterPage);