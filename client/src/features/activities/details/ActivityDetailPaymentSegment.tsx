import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon , Image, Modal} from 'semantic-ui-react'

import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { history } from '../../../index'
import { observer } from 'mobx-react-lite';
import SelectInput from '../../../app/common/form/SelectInput';
import { IActivity } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import tr  from 'date-fns/locale/tr'
import { format } from 'date-fns';
import LoginForm from '../../user/LoginForm';
import { useMediaQuery } from 'react-responsive';

const numberOptions = [
    { key: '1', value: 1, text: '1' },
    { key: '2', value: 2, text: '2' },
    { key: '3', value: 3, text: '3' },
    { key: '4', value: 4, text: '4' },
    { key: '5', value: 5, text: '5' }
  ]
  

 const ActivityDetailPaymentSegment:React.FC<{activity:IActivity}> = ({activity}) =>  {

  const rootStore = useContext(RootStoreContext);
  const {getActivityPaymentPage,attendActivity} = rootStore.activityStore;
  const {isLoggedIn} = rootStore.userStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;

  const [count, setCount] = useState(1);  

  // const handlePaySubmit = () =>{
  //   getActivityPaymentPage(count,activity.id);
  // }


  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const handleLoginClick = (e:any,str:string) => {
    e.stopPropagation();
    if(modal.open) closeModal();

        openModal("Giriş Yap", <>
        <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
        <Modal.Description className="loginreg">
        <LoginForm location={str} />
        </Modal.Description>
        </>,true,
        "","blurring",true) 
    }

   
const handleCardClick = (e:any) => {
    debugger;
    // if(!isLoggedIn)
    // {    var str = `/activities/${activity.id}`;
    //     handleLoginClick(e,str); 
    // }
    // else
    // {
        history.push(`/activities/${activity.id}`);
    //}
      
}

  const handlePaySubmit = (e:any) => {
      if(!isLoggedIn)
          {    
            var str = `/payment/activity/${activity.id}/${count.toString()}`; 

              handleLoginClick(e,str); 
          }
    else
    {
      if(activity.price && activity.price > 0 )
      {    
          var str = `/payment/activity/${activity.id}/${count.toString()}`; 
          history.push(str);

      }
      else
      {
        attendActivity();
      }
  }
}

    return (
           <Fragment>
             {/* <Segment
               textAlign='center'
               attached='top'
               inverted
               style={{ border: 'none' }}
               className="segmentHeader gradientSegment"
             >
               <Header>Aktiviteye Katıl</Header>
             </Segment> */}
             <Segment attached>
                 <div className="activityDetail_payment_title">
                 <h4 className="activityDetail_title">{activity.title}</h4>
              <span><Icon name="clock outline"></Icon>{Math.floor((new Date(activity.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) } gün sonra </span> 
                 </div>
             
              <div className="activityDetail_payment_calender">
              <Icon.Group size='big'>
                <Icon name="calendar alternate" className="activityDetail_payment_calenderIcon" />
                <Icon corner='bottom right' name="check circle" color="green" />
            </Icon.Group>
            <span>{format(new Date(new Date(activity.date).valueOf() - 86400000),'dd MMMM yyyy, eeee',{locale: tr})} -  { activity.date && format(activity.date, 'H:mm',{locale: tr})} tarihine kadar ücretsiz iptal. </span>
              </div>              
               { activity.price && activity.price >0 &&
                <FinalForm 
                  onSubmit ={handlePaySubmit}
                  render={({ form}) => (
                    <Form onSubmit={()=> form.reset()}>
                    <div className="activityDetail_payment">
                    <label style={{fontSize:"15px", color:"#222E50"}}><Icon name="user" /> Kişi Sayısı</label>
                    <Field
                        name="count"
                        placeholder="1"
                        component={SelectInput}
                        options={numberOptions}
                        />
                          <OnChange name="count">
                        {(value, previous) => {
                            debugger;
                            setCount(value);
                        }}
                 </OnChange>
                    </div>
                  </Form>
                  )}
                />}


                <div className="activityDetail_payment_calculation">
                    <div className="calculation">
                         <span style={{textDecoration:"underline",color: "#222E50"}}>{activity.price || 0} TL * {count} kişi</span>
                    </div>
                    <div>
                                <div>Toplam </div> 
                                <div className="price">{activity.price! * count} TL</div>
                     </div>
                </div>
        
       
                 
             </Segment>
             <Segment clearing attached='bottom' style={{backgroundColor:"#e8e8e8d1"}}>
                    
                      <div className="activityDetail_payment_footer">

                    <div>
                                <div>Toplam </div> 
                                <div className="price">{activity.price! * count} TL</div>
                     </div>
                      <Button circular className='green-gradientBtn'  floated='right' onClick ={handlePaySubmit} disabled={count === 0}
                       content={activity.price && activity.price > 0 ? 'Ödemeye geç': 'Rezervasyonu Tamamla'}></Button>

                    </div>
                   </Segment>
           </Fragment>
    )
}

export default observer(ActivityDetailPaymentSegment);