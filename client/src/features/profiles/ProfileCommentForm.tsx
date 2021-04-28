import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid, Header, Icon, Label } from 'semantic-ui-react';
import { StarRating } from '../../app/common/form/StarRating';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IProfileComment } from '../../app/models/profile';
import { v4 as uuid } from "uuid";

interface IProps{
    closeModal:() => void;
}

 const ProfileCommentForm:React.FC<IProps> = ({closeModal}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    sendTrainerComment
  } = rootStore.profileStore;

    const [rating, setRating] = useState(0);

    
    const handleFinalFormSubmit = async (values: IProfileComment) => {
      // const { ...comment } = values;
  
    
      //       let newComment = {
      //         ...comment,
      //         id: uuid(),
      //       };
           await sendTrainerComment(values);
    };

    return (
        <Grid>
            <Grid.Row>
            <Grid.Column>
             <div style={{textAlign:"right"}}>
            <Icon style={{cursor:"pointer"}} onClick={closeModal} name="times" size="large" color="teal"/>
            </div>
            <Header
              as="h4"
              content="Leave your comment"
              color="teal"
              textAlign="left"
              style={{marginTop:"0"}}
            />
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column>
        <FinalForm 
        onSubmit ={handleFinalFormSubmit}
        initialValues={{ allowDisplayName:false,body:"" }}
        render={({handleSubmit, submitting, form,values,initialValues}) => (
          <Form widths={"equal"} 
          onSubmit={() => handleSubmit()!.then(()=> {form.reset(); setRating(0); closeModal();})}
          >
           <Field
                  name="body"
                  placeholder="Add your comment"
                  component={TextAreaInput}
                  rows={6}
                />  
          <br/>
          {/* <Rating icon='star' defaultRating={3} maxRating={4} /> */}
           <StarRating rating={rating} setRating={setRating} editing={true} />
           <br/>
           <Label>
           <Field
              name="allowDisplayName"
              component="input"
              type="checkbox"
              format={v =>v === true}
              parse={v => (v ? true : false) }
            />&nbsp;&nbsp;
                    Kullanıcı adımın yorumlarda görünmesine izin veriyorum.
           </Label>
           
          <Button
          style={{marginTop: 12}}
          floated="right"
            content='Send'
            labelPosition='right'
            icon="send"
            positive
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


export default ProfileCommentForm