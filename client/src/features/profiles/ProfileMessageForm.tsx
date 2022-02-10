import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid,Image,Modal } from 'semantic-ui-react';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IMessageForm } from '../../app/models/message';
import LoginForm from '../user/LoginForm';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';

// interface IProps{
//     sendMessage:() => void;
// }

 const ProfileMessageForm:React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    profile,sendMessageFromProfile, submittingMessage
  } = rootStore.profileStore;
    const {isLoggedIn}= rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
  
    const handleLoginClick = (e:any,str:string) => {
    
      if(modal.open) closeModal();
  
          openModal("Giriş Yap", <>
          <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  wrapped />
          <Modal.Description className="loginreg">
          <LoginForm location={"/"} />
          </Modal.Description>
          </>,true,
          "","blurring",true, "loginModal") 
      }

    const handleFinalFormSubmit = async (values: IMessageForm) => {
        let newMessage = {
          ...values
        };
        if(isLoggedIn)
            {
              await sendMessageFromProfile(newMessage);
            }else{
              var str = `/profile/${profile!.userName}`;
              handleLoginClick(null,str);
            }
    
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
          onSubmit={() =>  handleSubmit()!.then(()=> {form.reset();})}
          >
           <Field
                  name="body"
                  placeholder={
                    profile!.hasConversation ? "Bu eğitmenle daha önce bir chat başlattın. Mesajlarına git." :
                    !isLoggedIn ? "Eğitmene mesaj atabilmek için giriş yapmalısın.":
                     "Eğitmene iletmek istediğiniz mesajınızı bırakın.."}
                  component={TextAreaInput}
                  rows={6}
                  disabled={profile!.hasConversation || !isLoggedIn}
                />  
          <br/>
          <Button
           className="sendMessageButton gradientBtn"
            content='Gönder'
            circular
            labelPosition='right'
            icon="send"
            disabled={profile!.hasConversation }
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


export default observer(ProfileMessageForm)