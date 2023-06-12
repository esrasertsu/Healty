import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid,Image,Modal } from 'semantic-ui-react';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { useStore } from '../../app/stores/rootStore';
import { IMessageForm } from '../../app/models/message';
import LoginForm from '../user/LoginForm';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import { runInAction } from 'mobx';
import { Link } from 'react-router-dom';

// interface IProps{
//     sendMessage:() => void;
// }

 const ProfileMessageForm:React.FC = () => {
  const rootStore = useStore();

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
          <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'} src='/assets/Login1.jpg'  wrapped />
          <Modal.Description className="loginreg">
          <LoginForm location={"/"} />
          </Modal.Description>
          </>,true,
          "","blurring",true, "loginModal") 
      }
      const CustomToastWithLink = (chatId:string) => (
        <div>
          <Link className='redirectMessageBox' to="/messages">Mesajın iletidi. Konuşmaya devam etmek için mesaj kutunu kontrol et.</Link>
        </div>
      );

    const handleFinalFormSubmit = async (values: IMessageForm) => {
        let newMessage = {
          ...values
        };
        if(isLoggedIn)
            {
             const chatId = await sendMessageFromProfile(newMessage);
             runInAction(() =>{
              if(chatId !== null && chatId!=undefined)
              toast.success(CustomToastWithLink(chatId))
           else 
             toast.error("Sayfayı yenileyip tekrar deneyin.")
             })
             
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
           className="sendMessageButton blueBtn"
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