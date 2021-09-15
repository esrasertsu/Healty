import React, { Fragment, useContext, useState } from 'react'
import { Button, Container, Header, Segment, Image, Grid, Card, Icon, Form, GridColumn, Label, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import TextInput from '../../app/common/form/TextInput';
import { Form as FinalForm, Field } from "react-final-form";
import SearchArea from './SearchArea';
import { history } from '../../index'
import TrainerForm from '../user/TrainerForm';
import Statistics from './Statistics';
import { useMediaQuery } from 'react-responsive'


const HomePage = () => {
 
  const token = window.localStorage.getItem('jwt');
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const [loading, setLoading] = useState(false);
  
    const [open, setOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [allCatId, setAllCatId] = React.useState("")

    const {setProfileFilterForm,profileFilterForm,clearProfileRegistery, setPage} = rootStore.profileStore;
    const {userCity} = rootStore.commonStore;
    const {setClearPredicateBeforeSearch,clearUserPredicates,clearKeyPredicate,setActiveUserPreIndex,
      clearActivityRegistery, setCategoryIds,categoryIds,setPredicate,setActiveIndex} = rootStore.activityStore;

      const {setClearedBeforeNewPredicateComing,clearPredicates} = rootStore.blogStore;

    

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const handleFinalFormSubmit = (values: any) => {
    }

    const handleLoginClick = (e:any) => {
      e.stopPropagation();
      if(modal.open) closeModal();

          openModal("Giriş Yap", <>
          <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.png' wrapped />
          <Modal.Description className="loginreg">
          <LoginForm location={"/"} />
          </Modal.Description>
          </>,true,
           <p>Üye olmak için <span className="registerLoginAnchor" onClick={handleRegisterClick}>tıklayınız</span></p>) 
      }

      const handleRegisterClick = (e:any) => {
    
        e.stopPropagation();
        if(modal.open) closeModal();

            openModal("Üye Kaydı", <>
            <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.png' wrapped />
            <Modal.Description className="loginreg">
            <RegisterForm location={"/"} />
            </Modal.Description>
            </>,true,
            <>
            <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>
            <p>Uzman başvuru için <span className="registerLoginAnchor" onClick={handleTrainerFormClick}>tıkla!</span></p>
            </>) 
        }

        const handleTrainerFormClick= (e:any) => {
    
          e.stopPropagation();
          if(modal.open) closeModal();

              openModal("Uzman Başvuru Formu", <>
              <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/welcome1.png' wrapped />
              <Modal.Description>
              <TrainerForm />
              </Modal.Description>
              </>,true,
              <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={handleLoginClick}>Giriş</span></p>) 
             
          }
  
    return (
      <>
      <Modal
      dimmer="blurring"
      closeIcon
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
            <span style={{fontSize:"15px"}}>{title}</span> alanında dilediğin kategoride uzman eğitmenler keşfetmek için
          </p>
          <p><Button color='blue' style={{display:'flex',  alignItems:"flex-end"}} onClick={() => {
            setOpen(false);
            setPage(0);
            setProfileFilterForm({...profileFilterForm, categoryId:allCatId});
            clearProfileRegistery();
            history.push('/profiles');
            }}>
          <Icon style={{opacity:"1"}} name='users' size="large"/> Ara
        </Button></p>
          </Segment>
          <Segment className="box">
          <Image size="large" src={'/assets/redirectModal/activity.jfif'}></Image>
          <Header>Aktivite</Header>
          <p>
            {title} alanında uzman eğitmenler tarafından düzenlenen aktivitelere katılmak için
          </p>
          <p><Button color='blue' style={{display:'flex',  alignItems:"flex-end"}} onClick={() => {
              setClearPredicateBeforeSearch(true); 
              clearUserPredicates();
              clearKeyPredicate("subCategoryIds");
              clearKeyPredicate("categoryIds");
              clearKeyPredicate("isOnline");
              clearKeyPredicate("startDate");
              clearKeyPredicate("endDate");
              clearKeyPredicate("levelIds");
              clearKeyPredicate("cityId");
              setActiveUserPreIndex(0);
              setPage(0);
              clearActivityRegistery();
              setOpen(false);
              setCategoryIds([allCatId]);
              setPredicate("categoryIds",allCatId);
              setClearPredicateBeforeSearch(false);
              setActiveIndex(0);
              history.push('/activities');
            }}>
          <Icon style={{opacity:"1"}} name='calendar alternate outline' size="large"/>
          Keşfet
        </Button></p>
          </Segment>
          <Segment className="box">
          <Image size="large" src={'/assets/redirectModal/blog.jfif'}></Image>
          <Header>Blog</Header>
          <p>
             {title} alanında uzman eğitmenlerin yazdığı blogları okuyarak bilgi sahibi ol
           </p>
          <p> <Button style={{display:'flex',  alignItems:"flex-end"}} color='blue'  onClick={() => {
            setOpen(false);
            setClearedBeforeNewPredicateComing(true);
            clearPredicates(null);
            rootStore.blogStore.setPredicate('categoryId', allCatId);
            setClearedBeforeNewPredicateComing(false);
            history.push('/blog')
            }}>
          <Icon style={{opacity:"1"}} name='file alternate outline' size="large"/>
          İncele
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
                   {/* {isLoggedIn && user && token ? (  */}
                   <Fragment>
                        <SearchArea/>
                   </Fragment>
                   {/* ): (
                       <Fragment>
                            <Header as='h2' inverted content={`Afitapp'a Hoşgeldin!`} />
                            <Button onClick={handleLoginClick} size='huge' inverted>
                                Üye Girişi
                             </Button>
                             <Button onClick={handleRegisterClick}  size='huge' inverted>
                                Yeni Kullanıcı
                             </Button>
                       </Fragment>
                   ) } */}
                  
                  
               </Container>
           </Segment>
           <Segment className="homepage_Segment">
           <div className="spacingContainer__small" />
           
           <Container className="homepageContainer">
           <Header as='h1'  style={{fontSize: '34px',  textAlign:'center', width:"100%" }}>
                Doğru uzmanı tam yerinde keşfet
                </Header>
                <p style={{ fontSize: '1.3rem', color: "#1a2b49" }}>
                Spor koçundan diyetisyene, meditasyon eğitmeninden psikoloğa ihtiyacın olan en doğru uzmanı en kolay şekilde bulabileceğin yerdesin. 
                Üstelik istediğin lokasyonda ya da online olarak aktivitelere katılabilir, eğitmenlerin paylaştıkları blogları okuyarak ilgilendiğin alanda bilgi sahibi olabilirsin. 
                </p>
           <Grid stackable >
        <Grid.Column width={16}>
          <Header
            floated='left'
            // icon='user'
            // content="Trainers"
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={ isMobile ? 1 : isTablet ? 2: 4}>
          <Card className="sporCard homepageCatCard" onClick={() => {
                  setAllCatId("d1245fcb-12b0-4b8b-8047-6a86b371b80b");
                  setOpen(true);
                  setTitle("Spor");
                }} >
                <Card.Content>
                    <Card.Header>Spor</Card.Header>
                    {/* <Label content="10 Uzman & Aktivite"/> */}
                </Card.Content>
            </Card>
            <Card className="diyetCard homepageCatCard" onClick={() => {
                setAllCatId("baed526c-a3cb-4d60-8ac7-98030112613a");
                setOpen(true);
                setTitle("Diyet");
                }} >
                <Card.Content>
                    <Card.Header>Diyet</Card.Header>
                    {/* <Label content="110 Uzman & Aktivite"/> */}
                </Card.Content>
            </Card>
            <Card className="meditasyonCard homepageCatCard" onClick={() => {
                setAllCatId("a5ffd0ff-c1f5-4979-84eb-3688daaca8a3");
                setOpen(true);
                setTitle("Meditasyon");
                }} >
                <Card.Content>
                    <Card.Header>Meditasyon</Card.Header>
                    {/* <Label content="Uzman & Aktivite"/> */}
                </Card.Content>
            </Card>
            
            <Card className="psikologCard homepageCatCard" onClick={() => {
                setAllCatId("cc6989f7-fa27-4aad-b4b7-fc1bbaf0a7b4");
                setOpen(true);
                setTitle("Psikoloji");
                }} >
                <Card.Content>
                    <Card.Header>Psikoloji</Card.Header>
                    {/* <Label content="110 Uzman & Aktivite"/> */}
                </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
      <div className="spacingContainer__small" />

      <Grid columns={3} textAlign='center'>

<Grid.Row >
  <Grid.Column width={isMobile ? "16": "5"}>
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
  <Grid.Column width={isMobile ? "16": "5"} >
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
  
  <Grid.Column width={isMobile ? "16": "5"}>
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
                        Uzman olduğun alanda deneyimlerini paylaşmak ve hizmet vermek için bize doğrudan başvurabilirsin, dilersen mail adresine de bilgilendirme gönderebiliriz.
                      <b><div style={{color:"#1a2b49", cursor:"pointer", textDecoration:"underline", marginTop:"10px"}} onClick={handleTrainerFormClick}>
                                Uzman Başvuru Formu için tıklayın..
                             </div></b>
                     
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

     {/* <Statistics /> */}
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