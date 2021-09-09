import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import NumberInput from '../../../app/common/form/NumberInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { IActivity } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import tr  from 'date-fns/locale/tr'
import { format } from 'date-fns';

const numberOptions = [
    { key: '1', value: 1, text: '1' },
    { key: '2', value: 2, text: '2' },
    { key: '3', value: 3, text: '3' },
    { key: '4', value: 4, text: '4' },
    { key: '5', value: 5, text: '5' },
    { key: '6', value:6, text: '6' },
    { key: '7', value: 7, text: '7' },
    { key: '8', value: 8, text: '8' },
    { key: '9', value: 9, text: '9' }
  ]
  

 const ActivityDetailPaymentSegment:React.FC<{activity:IActivity}> = ({activity}) =>  {

  const rootStore = useContext(RootStoreContext);
  const {getActivityPaymentPage} = rootStore.activityStore;

  const [count, setCount] = useState(1);  

  const handlePaySubmit = () =>{
    getActivityPaymentPage(count,activity.id);
  }


    return (
           <Fragment>
             <Segment
               textAlign='center'
               attached='top'
               inverted
               style={{ border: 'none' }}
               className="segmentHeader"
             >
               <Header>Aktiviteye Katıl</Header>
             </Segment>
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
                <FinalForm 
                  onSubmit ={handlePaySubmit}
                  render={({ form}) => (
                    <Form onSubmit={()=> form.reset()}>
                    <div className="activityDetail_payment">
                    <label style={{fontSize:"15px", color:"#263a5e"}}><Icon name="user" /> Kişi Sayısı</label>
                    <Field
                        name="count"
                        placeholder="0"
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
                />


                <div className="activityDetail_payment_calculation">
                    <div className="calculation">
                         <span style={{textDecoration:"underline",color: "#263a5e"}}>{activity.price!} ₺ * {count} kişi</span>
                    </div>
                    <div>
                                <div>Toplam </div> 
                                <div className="price">{activity.price! * count} ₺</div>
                     </div>
                </div>
        
       
                 
             </Segment>
             <Segment clearing attached='bottom' style={{backgroundColor:"#e8e8e8d1"}}>
                    
                      <div className="activityDetail_payment_footer">

                    <div>
                                <div>Toplam </div> 
                                <div className="price">{activity.price! * count} ₺</div>
                     </div>
                      <Button  floated='right' onClick ={handlePaySubmit} color='orange'
                       content={activity.price && activity.price > 0 ? 'Ödemeye geç': 'Rezervasyonu Tamamla'}></Button>

                    </div>
                   </Segment>
           </Fragment>
    )
}

export default observer(ActivityDetailPaymentSegment);