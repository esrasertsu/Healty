import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import FormPage1 from './FormPage1';

const TrainerOnboardingPage : React.FC<RouteComponentProps> = ({location}) =>{

    return(
        <>
         <Segment className="trainer_onboarding_announcement">
             <div style={{display:"flex",  alignItems:"center", justifyContent:"center"}}>
             <Image src="/icons/megaphone.png"  />   
             <span>İlk üyelere özel %30 indirimli komisyon fırsatını kaçırmayın!</span>
             </div>
             <div>
                 <Button content="Detaylı Bilgi" style={{background:"#ef8139fc", color:"white"}}  />
             </div>
         </Segment>
        <Grid style={{marginTop:"20px"}}>
            <Grid.Row>
                <Grid.Column width="8">
                <Segment>
                    <Header as="h2" textAlign="center">Uzman Başvurusu</Header>
                    <FormPage1 />
                </Segment>
                </Grid.Column>
                <Grid.Column width="8">
                   <Image src="/icons/online.png" />
                </Grid.Column>
            </Grid.Row>

        </Grid>
       </> 
    )
};

export default observer(TrainerOnboardingPage);

