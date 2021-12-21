import React, { useContext, useEffect, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Form, Header, Icon, Image, Message, Modal, Segment ,Input, Container} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';
import TextInput from '../../app/common/form/TextInput';


interface IErrorMessage {
    code:string,
    description:string
}

const ResetPassword : React.FC<RouteComponentProps> = ({location}) =>{

    const rootStore = useContext(RootStoreContext);
    
    const {openModal} = rootStore.modalStore;

    const {token, email} = queryString.parse(location.search);

    const [samePassword, setsamePassword] = useState(true)
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const [submitting, setSubmitting] = useState(false)
    const [showSuccessMessage, setshowSuccessMessage] = useState(false);
    const [showErrorMessage, setshowErrorMessage] = useState(false);
    const [psw1, setpsw1] = useState("");
    const [psw2, setpsw2] = useState("");
    const [errorMessage, setErrorMessage] = useState<IErrorMessage[]>([]);


        const handlePasswordReset = (e:any, data:any) => {
            debugger;
            setsamePassword(true);
            setshowSuccessMessage(false);
            setshowErrorMessage(false);
            if(psw1 !== psw2)
            {
                setsamePassword(false);
            }else{
                setSubmitting(true);
                agent.User.resetPassword(token as string,email as string,psw1 as string).then((res) => {
                    debugger;
                    if(res.succeeded===true)
                    { 
                       setshowSuccessMessage(true);
                        setSubmitting(false);
                    }
                    else {
                     setErrorMessage([...res.errors]);
                     setshowErrorMessage(true);
                     setSubmitting(false);
                    }
                }).catch((error) =>{
                    setSubmitting(false);
                    console.log(error);
                });
            }
          
        }


        const handleLoginClick = (e:any) => {
    
        
                openModal("Giriş Yap", <>
                <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
                <Modal.Description className="loginreg">
                <LoginForm location={"/"} />
                </Modal.Description>
                </>,true,
                "","blurring",true) 
            }
        const handlePass1Change = (e:any, data : any) => {
            setpsw1(data.value);
        }

        const handlePass2Change = (e:any, data : any) => {
            setpsw2(data.value);
        }

    return(
        <Container className="pageContainer">

        <Segment placeholder>
            
            {
                !showSuccessMessage ? (
                    <Header icon>
                    <Icon name="privacy" />
                    Yeni Şifre Oluşturma
                    </Header>
                ) :(
                    <Header icon>
                    <Icon name="thumbs up outline" />
                    Şifreniz Değiştirildi
                    </Header>
                )
                }
                

            <Segment.Inline>
                <div className="center">
                {
                  showSuccessMessage && (
                    <Message positive>
                         <p>Eposta adresi doğrulandı. Giriş yapmak için tıklayın.</p>
                        <Button onClick={handleLoginClick} primary content="Giriş Yap" size="large"/>
                     </Message>
                )
            } {
                !showSuccessMessage && (
                <Form onSubmit={handlePasswordReset} error>
                <Form.Field
                name="password"
                placeholder="*******"
                type="password"
                control={Input}
                label="*Şifre"
                onChange={handlePass1Change}
                /> 
                
                <Form.Field
                name="password2"
                placeholder="*******"
                type="password"
                control={Input}
                label="*Şifre Tekrar"
                onChange={handlePass2Change}
                />
            {!samePassword && (
             <Message negative>
                 <p>Girdiğiniz iki şifre aynı değil.</p>
             </Message> 
            )}
           
            {
                  showErrorMessage && (
                    <Message error>
                    {Object.keys(errorMessage).length > 0 && (
                        <Message.List>
                            {Object.values(errorMessage).flat().map((err: any, i) => (
                                <Message.Item key={i}>{ err.code === "InvalidToken" ? "Bu link üzerinden yalnızca 1 defa şifre değişikliği işlemi yapabilirsiniz.":
                                err.description }</Message.Item>
                            ))}
                        </Message.List>
                    )}
                    {/* {text && <Message.Content content={text} />} */}
                  </Message>
                )
            }
            <Button
              loading={submitting}
              color='teal'
              content="Oluştur"
              fluid
            />
          </Form>
                )
        }
                </div>
            </Segment.Inline>
        </Segment>
   </Container>
    )
}

export default observer(ResetPassword);
