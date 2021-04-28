import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid, Header, Icon, Label } from 'semantic-ui-react';
import { StarRating } from '../../app/common/form/StarRating';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IProfileComment } from '../../app/models/profile';
import { v4 as uuid } from "uuid";

// interface IProps{
//     sendMessage:() => void;
// }

 const ProfileMessageForm:React.FC = () => {
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
        <FinalForm 
        onSubmit ={handleFinalFormSubmit}
        initialValues={{ allowDisplayName:false,body:"" }}
        render={({handleSubmit, submitting, form,values,initialValues}) => (
          <Form widths={"equal"} 
          onSubmit={() => handleSubmit()!.then(()=> {form.reset(); setRating(0);})}
          >
           <Field
                  name="body"
                  placeholder="Mesaj.."
                  component={TextAreaInput}
                  rows={6}
                />  
          <br/>
          <Button
          className="sendMessageButton"
            content='Gönder'
            labelPosition='right'
            icon="send"
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


export default ProfileMessageForm