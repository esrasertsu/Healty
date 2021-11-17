import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import FormPage1 from './FormPage1';
import FormPage2 from './FormPage2';

const TrainerRegisterPage : React.FC<RouteComponentProps> = ({location}) =>{

    return(
        <Container className="pageContainer">

     
        <Grid style={{marginTop:"20px"}}>
            <Grid.Row>
                <Grid.Column>
                <Segment>
                    <Header as="h2" textAlign="center">Uzman Başvurusu</Header>
                    <FormPage2 />
                </Segment>
                </Grid.Column>
              
            </Grid.Row>

        </Grid>
       </Container> 
    )
};

export default observer(TrainerRegisterPage);

