import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid, Header, Icon, Label, Radio } from 'semantic-ui-react';
import { combineValidators, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { OnChange } from 'react-final-form-listeners';
import TextInput from '../../../app/common/form/TextInput';
import { IActivityOnlineJoinInfo } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';

interface IProps{
    closeModal:() => void;
}

const validate = combineValidators({
    meetingId: isRequired('meetingId')
})

 const ActivityJoinInfoForm:React.FC<IProps> = ({closeModal}) => {
  const rootStore = useContext(RootStoreContext);

 
  const {activityOnlineJoinInfo, setActivityOnlineJoinInfoForm,updateOnlineJoinInfo} = rootStore.activityStore;

    const [rating, setRating] = useState(0);

    
    const handleFinalFormSubmit = async (values: IActivityOnlineJoinInfo) => {
                updateOnlineJoinInfo(values).then(() => closeModal());
    };


    const handleZoomChange = (e:any, data:any) => {
        if(data.checked)
        {
            setActivityOnlineJoinInfoForm({...activityOnlineJoinInfo,zoom: true});

        }
        else 
        {

            setActivityOnlineJoinInfoForm({...activityOnlineJoinInfo,zoom: false});

        }

    }

    return (
        <Grid>
            <Grid.Row>
            <Grid.Column>
             <div style={{textAlign:"right"}}>
            {/* <Icon style={{cursor:"pointer"}} onClick={closeModal} name="times" size="large" color="orange"/> */}
            </div>
            <Header
              as="h4"
              content="Online aktivitenizin katılım bilgilerini giriniz. Eğer zoom kutucuğunu işaretlerseniz, sadece id ve şifre bilgilerini girmeniz yeterli olacaktır ve aktivite içindeki 'katıl' butonu ile toplantıya direk katılım sağlanabilecektir."
              className="blueBtn"
              textAlign="left"
              style={{marginTop:"0"}}
              icon="video"
            />
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column>
        <FinalForm 
        onSubmit ={handleFinalFormSubmit}
        validate={validate}
        initialValues={activityOnlineJoinInfo}

        render={({handleSubmit, submitting, form,values,invalid}) => (
          <Form widths={"equal"} 
          onSubmit={() => handleSubmit()!.then(()=> {form.reset(); closeModal();})}
          >
              <div className="activityJoinInfo_formfields">
              <label>Zoom </label>
            <Radio checked={activityOnlineJoinInfo.zoom} toggle={true} onChange={handleZoomChange} disabled={false} /> 
            <label style={{marginLeft:"10px", color:"#b20000"}}> *Zoom üzerinden gerçekleşecek aktivitelerde bu seçeneği işaretleyiniz.  </label>
           
              </div>
            <div className="activityJoinInfo_formfields">
            <label>Meeting Id</label>
            <Field name="meetingId" placeholder="Örn: Zoom için 822 715 8503" component={TextInput} value={activityOnlineJoinInfo.meetingId}/>
            <OnChange name="meetingId">
                {(value, previous) => {
                    if(value !== activityOnlineJoinInfo.meetingId)
                    {
                        setActivityOnlineJoinInfoForm({...activityOnlineJoinInfo,meetingId: value});
                    }
                }}
            </OnChange>
            </div>
            <div className="activityJoinInfo_formfields"> 
            <label>Şifre</label>
            <Field name="meetingPsw" placeholder="Şifre" component={TextInput} value={activityOnlineJoinInfo.meetingPsw}/>
            <OnChange name="meetingPsw">
                {(value, previous) => {
                    if(value !== activityOnlineJoinInfo.meetingPsw)
                    {
                        setActivityOnlineJoinInfoForm({...activityOnlineJoinInfo,meetingPsw: value});
                    }
                }}
            </OnChange>
            </div>
            <div className="activityJoinInfo_formfields">
           <label>Davet Linki</label>
           <Field
                  name="activityUrl"
                  placeholder="Örn: 'https://us04web.zoom.us/j/8227158503?pwd=VmZITUFpZ0VPcjEvT2NUc1pRbU5FZz09'"
                  component={TextAreaInput}
                  rows={2}
                  value={activityOnlineJoinInfo.activityUrl}
                />  
                <OnChange name="activityUrl">
                {(value, previous) => {
                    if(value !== activityOnlineJoinInfo.activityUrl)
                    {
                        setActivityOnlineJoinInfoForm({...activityOnlineJoinInfo,activityUrl: value});
                    }
                }}
            </OnChange>
            </div>
          <Button
          style={{marginTop: 12}}
          disabled={invalid}
          floated="right"
          circular
            content='Ekle'
            labelPosition='right'
            icon="check"
            color="orange"
            loading={submitting}
          />
        </Form>
        
        )}
      />
      </Grid.Column>
      </Grid.Row>
      </Grid>
    )
}


export default observer(ActivityJoinInfoForm)