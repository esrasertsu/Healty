import React, { useContext, useEffect, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Container, Header, Icon, Image, Modal, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';

const VerifyEmail : React.FC<RouteComponentProps> = ({location}) =>{

    const rootStore = useContext(RootStoreContext);
    const Status = {
        Verifying: "Verifying",
        Failed:"Failed",
        Success:"Success"
    }
    
    const [status,setStatus] = useState(Status.Verifying);
    const {openModal} = rootStore.modalStore;

    const {token, email} = queryString.parse(location.search);

    
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    useEffect(() => {
        agent.User.verifyEmail(token as string,email as string).then(() => {
            setStatus(Status.Success);
        }).catch(() =>{
            setStatus(Status.Failed);
        })
      
    }, [Status.Failed, Status.Success, token, email])

    const handleLoginClick = (e:any) => {
        
            openModal("Giriş Yap", <>
            <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
            <Modal.Description className="loginreg">
            <LoginForm location={"/"} />
            </Modal.Description>
            </>,true,
            "","blurring",true) 
        }

        const handleConfiedEmailResend = () => {
            agent.User.resendVerifyEmailConfirm(email as string).then(() => {
                toast.success('Doğrulama linki yeniden gönderildi - Lütfen e-posta kutunu kontrol et');
            }).catch((error) => console.log(error));
        }

    const getBody = () => {
        switch (status) {
            case Status.Verifying:
                return (
                <p>Doğrulanıyor..</p>
                )
                case Status.Failed:
                    return (
                        <div className="center">
                            <p>Doğrulama başarısız - tekrar doğrulama linki gönderilmesini talep edebilirsin.</p>
                            <Button onClick={handleConfiedEmailResend} circular primary content="Yeniden Gönder" size="huge"/>
                        </div>
                    )
                   
                    case Status.Success:
                        return (
                            <div className="center">
                                <p>Eposta adresi doğrulandı. Giriş yapmak için tıklayın.</p>
                                <Button onClick={handleLoginClick} circular primary content="Giriş Yap" size="large"/>
                            </div>
                        )
                       
            default:
                break;
        }
    }



    return(
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon name="envelope" />
                Email Doğrulama
            </Header>

            <Segment.Inline>
                <div className="center">
                   {getBody()}
                </div>
            </Segment.Inline>
        </Segment>
        </Container>
    )
}

export default observer(VerifyEmail);
