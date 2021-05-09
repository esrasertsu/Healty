import React, { Fragment, useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Image, Grid, Card, Icon, Form, GridColumn, List, Search, Label, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import TextInput from '../../app/common/form/TextInput';
import { Form as FinalForm, Field } from "react-final-form";
import SearchArea from './SearchArea';
import { history } from '../../index'


const HomePage = () => {

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal} = rootStore.modalStore;
    const [loading, setLoading] = useState(false);
  
    const [open, setOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")

    const handleFinalFormSubmit = (values: any) => {
    }

    
    return (
      <>
      <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {/* <Modal.Header></Modal.Header> */}
      <Modal.Content>
        {/* <Image size='medium' src={'/assets/redirectModal/trainer.jfif'} wrapped /> */}
         <Modal.Description className="homepageCatCardModal_segmentContainer">
         <Segment className="box">
          <Image size="large" src={'/assets/redirectModal/trainer.jfif'}></Image>
         <Header>Uzman Eğitmen</Header>
          <p>
            <span style={{fontSize:"15px"}}>{title}</span> alanında dilediğin kategoride uzman eğitmenler keşfet
          </p>
          <p><Button color='blue' style={{display:'flex',  alignItems:"flex-end"}} onClick={() => {setOpen(false);history.push('/profiles');}}>
          <Icon style={{opacity:"1"}} name='users' size="large"/> Ara
        </Button></p>
          </Segment>
          <Segment className="box">
          <Image size="large" src={'/assets/redirectModal/activity.jfif'}></Image>
          <Header>Aktivite</Header>
          <p>
            {title} alanında eğitmenler tarafından düzenlenen aktivitelere katıl
          </p>
          <p><Button color='blue' style={{display:'flex',  alignItems:"flex-end"}} onClick={() => {setOpen(false); history.push('/activities')}}>
          <Icon style={{opacity:"1"}} name='calendar alternate outline' size="large"/>
          Katıl
        </Button></p>
          </Segment>
          <Segment className="box">
          <Image size="large" src={'/assets/redirectModal/blog.jfif'}></Image>
          <Header>Blog</Header>
          <p>
             {title} alanında eğitmenlerin yazdığı blogları okuyarak bilgi sahibi ol
           </p>
          <p> <Button style={{display:'flex',  alignItems:"flex-end"}} color='blue' onClick={() => {setOpen(false);history.push('/blog');}}>
          <Icon style={{opacity:"1"}} name='file alternate outline' size="large"/>
          Keşfet
        </Button> </p>
          </Segment>
         
        </Modal.Description> 
        {/* <Image size='medium' src={'/assets/redirectModal/activity.jfif'} wrapped />
        <Image size='medium' src={'/assets/redirectModal/blog.jpg'} wrapped /> */}
      </Modal.Content>
    {/*   <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Keşfet"
          labelPosition='right'
          icon='arrow'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions> */}
    </Modal>
        <Fragment>
           <Segment inverted textAlign='center' vertical className='masthead'>
               <Container text>
                   <Header as='h1' inverted>
                       {/* <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/> */}
                       Dilediğin kategoride sağlıklı yaşam uzmanını ara
                   </Header>
                   {isLoggedIn && user ? ( 
                   <Fragment>
                        {/* <Header as='h2' inverted content={`Welcome back ${user.displayName}`} /> */}
                        <Container className='homePage-button_Container'>
                        <SearchArea className="SearchArea" placeholder="Arama yapmak istediğin kategori.." />
                        {/* <Button as={Link} to='/activities' size='big' inverted>
                            See the activities
                        </Button>
                        <Button as={Link} to='/profiles' size='big' inverted>
                            Find your couch
                        </Button> */}
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
              <Header as='h1'  style={{  textAlign:'center', width:"100%" }}>
                Doğru uzmanı tam yerinde keşfet
                </Header>
                <p style={{ fontSize: '1.25em', color: "#1a2b49" }}>
                Spor koçundan diyetisyene, meditasyon eğitmeninden psikoloğa ihtiyacın olan en doğru uzmanı en kolay şekilde bulabileceğin yerdesin. 
                Üstelik istediğin lokasyonda ya da online olarak aktivitelere katılabilir, eğitmenlerin paylaştıkları blogları okuyarak ilgilendiğin alanda bilgi sahibi olabilirsin. 
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
          <Card className="sporCard homepageCatCard" onClick={() => {setOpen(true);
                        setTitle("Spor");

               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                {/* <Image src={'/assets/categoryImages/spor.jpg'} /> */}
                <Card.Content>
                    <Card.Header>Spor</Card.Header>
                    <Label content="10 Uzman & Aktivite"/>
                </Card.Content>
            </Card>
            <Card className="diyetCard homepageCatCard" onClick={() => {setOpen(true);
                        setTitle("Diyet");

               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                {/* <Image src={'/assets/categoryImages/diyetisyenn.jpg'} /> */}
                <Card.Content>
                    <Card.Header>Diyet</Card.Header>
                    <Label content="110 Uzman & Aktivite"/>
                </Card.Content>
            </Card>
            <Card className="meditasyonCard homepageCatCard" onClick={() => {setOpen(true);
                        setTitle("Meditasyon");

               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                {/* <Image src={'/assets/categoryImages/meditasyon.jpg'} /> */}
                <Card.Content>
                    <Card.Header>Meditasyon</Card.Header>
                    <Label content="85 Uzman & Aktivite"/>
                </Card.Content>
            </Card>
            
            <Card className="psikologCard homepageCatCard" onClick={() => {
            setOpen(true);
            setTitle("Psikoloji");
               // history.push(`/profile/${profile.userName}`)
              //  setLoadingProfile(true);
                }} >
                {/* <Image src={'/assets/categoryImages/psikolog.jpg'} /> */}
                <Card.Content>
                    <Card.Header>Psikoloji</Card.Header>
                    <Label content="110 Uzman & Aktivite"/>
                </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
      <div className="spacingContainer__small" />

      <Grid columns={3} stackable textAlign='center'>

<Grid.Row verticalAlign='middle'>
  <Grid.Column>
    <Header as='h3' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} size="small" circular inverted color='teal' name='calendar check outline' />     
        <Header.Content>
            Aktivite Planla
            <Header.Subheader className="homepage_subheader">
            Uzman danışmanların oluşturmuş olduğu aktivitelere katılabilir, sağlığın için kendine vakit ayırırken aynı zamanda sosyalleşmenin de tadını çıkarabilirsin.  
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
  <Grid.Column>
    <Header as='h3' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} circular inverted color='teal' flipped='horizontally' name='history' />
        <Header.Content>
            Hızlı Erişim
            <Header.Subheader className="homepage_subheader">
            İhtiyacın olan uzmanı aramak için zaman kaybetme, uzman bloglarını ve yorumlarını inceleyerek tek bir platform üzerinden hızlıca bilgi sahibi ol.
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
  
  <Grid.Column>
    <Header as='h3' icon>
        <Icon style={{fontSize:"1.5rem", marginBottom:"15px"}} size="small" circular inverted color='teal' name='heart' />
        <Header.Content>
            Online Destek 
            <Header.Subheader className="homepage_subheader">
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
                <Header.Subheader style={{fontSize:"1.2rem",marginBottom:"20px"}}>
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
                            <Button  
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
        </Fragment>
    </>
    );
};

export default HomePage