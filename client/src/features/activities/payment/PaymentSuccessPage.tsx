import React, { useEffect, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../../app/api/agent';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';


const PaymentSuccessPage : React.FC<RouteComponentProps> = ({location}) =>{
    const {status,activityId,count} = queryString.parse(location.search);
const [activityName, setActivityName] = useState("");
   useEffect(() => {
       if(status)
         agent.Activities.details(activityId as string).then((res)=>{
           setActivityName(res.title)
         })
   }, [status])

    return(
        <Segment placeholder>
            <Header icon>
                <Icon name="check" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <p>Satın alma işleminiz başarıyla gerçekleşti.</p>
                    <p>{activityName}</p>
                </div>
            </Segment.Inline>
        </Segment>
    )
};

export default observer(PaymentSuccessPage);

