import React, { useEffect, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../../app/api/agent';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';


const PaymentSuccessPage : React.FC<RouteComponentProps> = ({location}) =>{
    const {errorMessage, errorCode } = queryString.parse(location.search);
const [errorsMessage, setErrorMessage] = useState("");
const [errorsCode, setErrorCode] = useState("");

   useEffect(() => {
       if(errorMessage !== "" && errorMessage !== null)
         setErrorMessage(errorMessage.toString());
         errorCode ? setErrorCode(errorCode.toString()) : setErrorCode("");
   }, [errorMessage])

    return(
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon color="red" name="exclamation triangle" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <p>Üzgünüz, satın alma işlemi gerçekleşemedi.</p>
                    <p>{errorCode} - {errorsMessage}</p>
                    <p>Lütfen kartınızı kontrol edin ya da bankanızla iletişime geçin.</p>
                </div>
            </Segment.Inline>
        </Segment>
        </Container>
    )
};

export default observer(PaymentSuccessPage);

