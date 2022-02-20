import { format } from 'date-fns';
import { Form as FinalForm , Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { Button, Form, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { StarRating } from '../../../app/common/form/StarRating';
import TextAreaInput from '../../../app/common/form/TextAreaInput';

export const ActivityReview:React.FC<{activity:IActivity}> = ({activity}) => {
    const rootStore = useContext(RootStoreContext);
    const {user} = rootStore.userStore;
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const {isLoggedIn} = rootStore.userStore;

    const [rating, setRating] = useState(0);

    const handleFinalFormSubmit = async (values: any) => {
      debugger;
    

      }

    return (
           <>
            <Header>Değerlendirme Formu  </Header>
            <Segment>
            <h4 className="activityDetail_title">Aktivite hakkındaki görüşleriniz</h4>
            <>
            <FinalForm 
            onSubmit ={handleFinalFormSubmit}
            initialValues={{ body:"" }}
            render={({handleSubmit, form,submitting,values,initialValues}) => (
              <Form widths={"equal"} 
              onSubmit={() => handleSubmit()!.then(()=> {form.reset(); setRating(0); })}
              >
                
                 <StarRating rating={rating} setRating={setRating} editing={true} showCount={false}/>
                <br/>
                <Field
                        name="body"
                        placeholder="Aktivite hakkındaki düşünceleriniz, tecrübeleriniz..."
                        component={TextAreaInput}
                        rows={6}
                      />  
                      <div style={{height:"35px"}}> 
                        <Button
                    type="submit"
                    floated="right"
                      content='Gönder'
                      circular className='blueBtn'
                      loading={submitting}
                    />  

                      </div>
               
          
                {/* <Rating icon='star' defaultRating={3} maxRating={4} /> */}
                
         
              </Form>
        
              )}
            />
  </>
            </Segment>
            </>
    )
}


export default observer(ActivityReview);