import { format } from 'date-fns';
import { Form as FinalForm , Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { Button, Form, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { IActivity, IActivityReview } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { StarRating } from '../../../app/common/form/StarRating';
import TextAreaInput from '../../../app/common/form/TextAreaInput';

export const ActivityReview:React.FC<{activity:IActivity}> = ({activity}) => {
    const rootStore = useContext(RootStoreContext);
    const {sendReview} = rootStore.activityStore;
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const {isLoggedIn} = rootStore.userStore;

    const [rating, setRating] = useState(0);
    const [success, setSuccess] = useState(true);

    const handleFinalFormSubmit = async (values: IActivityReview) => {

      const { ...comment } = values;
  
      if(isLoggedIn)
      {
        let newComment = {
          ...comment,
          activityId: activity.id,
          starCount: rating
        };
       await sendReview(newComment)
      }
      

      }

    return (
           <>
            
            {
              (!activity.hasCommentByUser && isLoggedIn && activity.isAttendee) && 
              <Segment>
              <h4 className="activityDetail_title">Aktivite hakkındaki görüşleriniz</h4>
              <>
              <FinalForm 
              onSubmit ={handleFinalFormSubmit}
              initialValues={{allowDisplayName:false, body:"" }}
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
                        <div>
                        <Field
                          name="allowDisplayName"
                          component="input"
                          type="checkbox"
                          format={v =>v === true}
                          parse={v => (v ? true : false) }
                        />&nbsp;&nbsp;
                          Kullanıcı adımın yorumlarda görünmesine izin veriyorum.
                          </div>
               
                        <div style={{height:"35px"}}> 
                          <Button
                      type="submit"
                      floated="right"
                        content='Gönder'
                        circular className='blueBtn'
                        loading={submitting}
                        disabled={!isLoggedIn}
                      />  
  
                        </div>
                 
            
                  {/* <Rating icon='star' defaultRating={3} maxRating={4} /> */}
                  
           
                </Form>
          
                )}
              />
    </>
              </Segment>
            }
           
            </>
    )
}


export default observer(ActivityReview);