import React, { Fragment, useContext, useState } from 'react'
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Image, Grid, Card, Icon, Form, GridColumn, List } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import TextInput from '../../app/common/form/TextInput';
import { Form as FinalForm, Field } from "react-final-form";

const HomePage = () => {

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal} = rootStore.modalStore;
    const [loading, setLoading] = useState(false);

    const handleFinalFormSubmit = (values: any) => {
    }
    return (
        <Fragment>
           <Segment inverted textAlign='center' vertical className='masthead'>
               <Container text>
                   <Header as='h1' inverted>
                       {/* <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/> */}
                       Sağlıklı yaşam uzmanını ara
                   </Header>
                   {isLoggedIn && user ? ( 
                   <Fragment>
                        {/* <Header as='h2' inverted content={`Welcome back ${user.displayName}`} /> */}
                        <Container className='homePage-button_Container'>
                        <Button as={Link} to='/activities' size='big' inverted>
                            See the activities
                        </Button>
                        <Button as={Link} to='/profiles' size='big' inverted>
                            Find your couch
                        </Button>
                        <Button as={Link} to='/profiles' size='big' primary circular>
                           <Icon name='search' inverted></Icon> Ara
                        </Button>
                        </Container>
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
           <Segment className="homepage_Segment">
           <div className="spacingContainer__small" />
           
           <Container className="homepageContainer">
           <Grid container stackable >
              <Header as='h3' style={{ fontSize: '2em', textAlign:'center', width:"100%" }}>
                Doğru uzmanı tam yerinde keşfet
                </Header>
                <p style={{ fontSize: '1.17em' }}>
                Spor koçundan diyetisyene, meditasyon eğitmeninden psikoloğa ihtiyacın olan en doğru uzmanı en kolay şekilde bulabileceğin yerdesin. 
                Üstelik lokasyon bazlı uzman ve aktivite araması yapabilir, paylaştıkları bloglardan ve düzenledikleri etkinliklerden anında haberdar olabilirsin. 
                </p>
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
      <div className="spacingContainer__small" />

      <Grid columns={3} stackable textAlign='center'>

<Grid.Row verticalAlign='middle'>
  <Grid.Column>
    <Header as='h4' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} size="small" circular inverted color='teal' name='calendar check outline' />     
        <Header.Content>
            Aktivite Planla
            <Header.Subheader style={{marginTop:"10px"}}>
            Uzman danışmanların oluşturmuş olduğu aktivitelere katılabilir, sağlığın için kendine vakit ayırırken aynı zamanda sosyalleşmenin de tadını çıkarabilirsin.  
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
  <Grid.Column>
    <Header as='h4' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} circular inverted color='teal' flipped='horizontally' name='history' />
        <Header.Content>
            Hızlı Erişim
            <Header.Subheader style={{marginTop:"10px"}}>
            İhtiyacın olan uzmanı aramak için zaman kaybetme, uzman bloglarını ve yorumlarını inceleyerek tek bir platform üzerinden hızlıca bilgi sahibi ol.
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
  
  <Grid.Column>
    <Header as='h4' icon>
        <Icon style={{fontSize:"1.5rem", marginBottom:"15px"}} size="small" circular inverted color='teal' name='heart' />
        <Header.Content>
            Online Destek 
            <Header.Subheader style={{marginTop:"10px"}}>
            Deneyimini güçlendirmek ve sana daha iyi yardımcı olabilmek için doğrudan danışmanlarla iletişime geçmeni sağlıyoruz. 
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
 
</Grid.Row>
</Grid>
<div style={{display:"flex"}}>
        <div className="spacingContainer__small" />
    </div>
<Segment clearing secondary className="homepage_contactus-form">
<Grid columns={2} stackable textAlign='left'>
    <Grid.Row verticalAlign='middle' className="contactus-row">
        <Grid.Column>
            <Image src={'/assets/contactus.jpg'} />
        </Grid.Column>
       
        <Grid.Column>
                <Header as="h1">
                    <Header.Content>Desteğine herkesin ihtiyacı var</Header.Content>
                </Header>
                <Header.Subheader style={{fontSize:"1.1rem",marginBottom:"20px"}}>
                        Uzman olduğun alanda deneyimlerini paylaşmak ve hizmet vermek için bize doğrudan ulaşabilirsin, dilersen mail adresine de bilgilendirme gönderebiliriz.
                </Header.Subheader>
                <FinalForm
               // validate = {validate}
              //  initialValues={post}
                onSubmit={handleFinalFormSubmit}
                render={({ handleSubmit, invalid, pristine }) => (
                    <Form loading={loading}>
                        <Grid columns={2} stackable>
                        <Grid.Row verticalAlign='middle'>
                            <GridColumn  width={10}>
                            <Field
                            name="title"
                            placeholder="Email"
                            //   value={post.title}
                            component={TextInput}
                            />
                            </GridColumn>
                            <GridColumn  width={6}>
                            <Button size='big' 
                            primary 
                            circular
                            disabled={loading}
                            floated="left"
                            content="Gönder"
                            type="submit">
                           <Icon name='send' inverted></Icon> Gönder
                        </Button>
                            </GridColumn>
                            </Grid.Row>
                        </Grid>
                       
                   
                    </Form>
            )}
            />
        </Grid.Column>

        </Grid.Row>
        </Grid>
        </Segment>
    <div style={{display:"flex"}}>
        <div className="spacingContainer__small" />
    </div>
<br/>
      </Container>
      </Segment>
      
      
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Religious Ceremonies</List.Item>
                <List.Item as='a'>Gazebo Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Banana Pre-Order</List.Item>
                <List.Item as='a'>DNA FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite X-Men</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
        </Fragment>
    );
};

export default HomePage