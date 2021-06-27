import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid, } from 'semantic-ui-react';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IMessageForm } from '../../app/models/message';

// interface IProps{
//     sendMessage:() => void;
// }

 const ProfileMessageForm:React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    profile,sendMessageFromProfile, submittingMessage
  } = rootStore.profileStore;

    
    const handleFinalFormSubmit = async (values: IMessageForm) => {
      let newMessage = {
        ...values
      };
           await sendMessageFromProfile(newMessage);
    };

    return (
        <Grid>
            <Grid.Row>
            <Grid.Column>
        <FinalForm 
        onSubmit ={handleFinalFormSubmit}
       // initialValues={{ body:"" }}
        render={({handleSubmit, submitting, form}) => (
          <Form widths={"equal"} 
          onSubmit={() => handleSubmit()!.then(()=> {form.reset();})}
          >
           <Field
                  name="body"
                  placeholder={profile!.hasConversation ? "Bu eğitmenle daha önce bir chat başlattın. Mesajlarına git." : "Eğitmene iletmek istediğiniz mesajınızı bırakın.."}
                  component={TextAreaInput}
                  rows={6}
                  disabled={profile!.hasConversation}
                />  
          <br/>
          <Button
           className="sendMessageButton"
            content='Gönder'
            labelPosition='right'
            icon="send"
            disabled={profile!.hasConversation}
            loading={submitting || submittingMessage}
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