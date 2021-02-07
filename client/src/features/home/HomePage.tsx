import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Image, Grid, Card } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';

const HomePage = () => {

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal} = rootStore.modalStore;

    return (
        <Fragment>
           <Segment inverted textAlign='center' vertical className='masthead' >
               <Container text>
                   <Header as='h1' inverted>
                       <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
                       Reactivities
                   </Header>
                   {isLoggedIn && user ? ( 
                   <Fragment>
                        <Header as='h2' inverted content={`Welcome back ${user.displayName}`} />
                        <Button as={Link} to='/activities' size='huge' inverted>
                            See the activities
                        </Button>
                        <Button as={Link} to='/profiles' size='huge' inverted>
                            Find your couch
                        </Button>
                   </Fragment>
                   ): (
                       <Fragment>
                            <Header as='h2' inverted content='Welcome to Reactivities' />
                            <Button onClick={()=>openModal("Login",<LoginForm />)} size='huge' inverted>
                                Login
                             </Button>
                             <Button onClick={()=>openModal("Register",<RegisterForm />)}  size='huge' inverted>
                                Register
                             </Button>
                       </Fragment>
                   )}
                  
               </Container>
           </Segment>
           <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            // icon='user'
            // content="Trainers"
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
          <Card onClick={() => {
               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                <Image src={'/assets/categoryImages/psikolog.jpg'} />
                <Card.Content>
                    <Card.Header>Psikoloji</Card.Header>
                </Card.Content>
                {/* <Card.Content extra>
                    <div>
                    <Icon name='user' />
                    {profile.followerCount} 
                    </div>
                </Card.Content> */}
            </Card>
            <Card onClick={() => {
               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                <Image src={'/assets/categoryImages/diyetisyenn.jpg'} />
                <Card.Content>
                    <Card.Header>Diyet</Card.Header>
                </Card.Content>
                {/* <Card.Content extra>
                    <div>
                    <Icon name='user' />
                    {profile.followerCount} 
                    </div>
                </Card.Content> */}
            </Card>
            <Card onClick={() => {
               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                <Image src={'/assets/categoryImages/meditasyon.jpg'} />
                <Card.Content>
                    <Card.Header>Meditasyon</Card.Header>
                </Card.Content>
                {/* <Card.Content extra>
                    <div>
                    <Icon name='user' />
                    {profile.followerCount} 
                    </div>
                </Card.Content> */}
            </Card>
            <Card onClick={() => {
               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                <Image src={'/assets/categoryImages/spor.jpg'} />
                <Card.Content>
                    <Card.Header>Spor</Card.Header>
                </Card.Content>
                {/* <Card.Content extra>
                    <div>
                    <Icon name='user' />
                    {profile.followerCount} 
                    </div>
                </Card.Content> */}
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
        </Fragment>
    );
};

export default HomePage