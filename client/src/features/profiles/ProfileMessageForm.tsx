import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid,Image,Modal } from 'semantic-ui-react';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IMessageForm } from '../../app/models/message';
import { RegisterForm } from '../user/RegisterForm';
import LoginForm from '../user/LoginForm';
import { observer } from 'mobx-react-lite';

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


    
  const handleRegisterClick = (e:any,str:string) => {
    
    e.stopPropagation();
    if(modal.open) closeModal();

        openModal("Üye Kaydı", <>
        <Image size='large' src='/assets/Login1.png' wrapped />
        <Modal.Description>
        <RegisterForm location={str} />
        </Modal.Description>
        </>,true,
        <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={() => handleLoginClick(e,str)}>Giriş</span></p>) 
    }

    const handleLoginClick = (e:any,str:string) => {
      e.stopPropagation();
      if(modal.open) closeModal();

          openModal("Giriş Yap", <>
          <Image size='large' src='/assets/Login1.png' wrapped />
          <Modal.Description>
          <LoginForm location={str} />
          </Modal.Description>
          </>,true,
           <p className="modalformFooter">Üye olmak için <span className="registerLoginAnchor" onClick={() => handleRegisterClick(e,str)}>tıklayınız</span></p>) 
      }

    const handleFinalFormSubmit = async (e:any,values: IMessageForm) => {
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
        onSubmit ={() => handleFinalFormSubmit}
       // initialValues={{ body:"" }}
        render={({handleSubmit, submitting, form}) => (
          <Form widths={"equal"} 
          onSubmit={(e) => {
            if(isLoggedIn)
            {
              handleSubmit()!.then(()=> {form.reset();})
            }else{
              var str = `/profile/${profile!.userName}`;
              handleLoginClick(e,str);
            }
          }
           
          }
          >
           <Field
                  name="body"
                  placeholder={
                    profile!.hasConversation ? "Bu eğitmenle daha önce bir chat başlattın. Mesajlarına git." :
                    !isLoggedIn ? "Eğitmene mesaj atabilmek için üye olmalısın.":
                     "Eğitmene iletmek istediğiniz mesajınızı bırakın.."}
                  component={TextAreaInput}
                  rows={6}
                  disabled={profile!.hasConversation || !isLoggedIn}
                />  
          <br/>
          <Button
           className="sendMessageButton"
            content='Gönder'
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