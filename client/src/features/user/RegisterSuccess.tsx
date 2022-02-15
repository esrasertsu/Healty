import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

const RegisterSuccess : React.FC<RouteComponentProps> = ({location}) =>{
    const {email} = queryString.parse(location.search);

    const handleConfiedEmailResend = () => {
        agent.User.resendVerifyEmailConfirm(email as string).then(() => {
            toast.success('Doğrulama linki yeniden gönderildi - Lütfen epostanızı kontrol edin');
        }).catch((error) => console.log(error));
    }

    return(
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon name="check" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <p>Lütfen E-posta'nıza gönderdiğimiz link ile adresinizi doğrulayınız.</p>
                    {email &&
                    <>
                         <p>Eposta'nız size ulaşmadı mı? Aşağıdaki butuna tıklayarak yeniden gönderilmesini talep edebilirsiniz.</p>
                        <Button onClick={handleConfiedEmailResend} primary content="Yeniden Gönder" circular/>
                    </>

                    }
                </div>
            </Segment.Inline>
        </Segment>
        </Container>
    )
};

export default observer(RegisterSuccess);

