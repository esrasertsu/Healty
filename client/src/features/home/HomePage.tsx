import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Container, Header, Segment, Image, Grid, Icon, Modal } from 'semantic-ui-react'
import { useStore } from '../../app/stores/rootStore';
import { Helmet } from 'react-helmet-async';
import { useMediaQuery } from 'react-responsive'
import ActivitySearchArea from './ActivitySearchArea';
import { observer } from 'mobx-react-lite';
import ActivityListItemPlaceholder from '../activities/dashboard/ActivityListItemPlaceHolder';
import ActivityList from '../activities/dashboard/ActivityList';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();
    const rootStore = useStore();
    const {user} = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;
    const [loading, setLoading] = useState(false);
  
    const [open, setOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")

    const { setPage,page} = rootStore.profileStore;
    const {setClearPredicateBeforeSearch,clearUserPredicates,clearKeyPredicate,setActiveUserPreIndex,
      clearActivityRegistery, loadActivities,setActiveIndex,loadingInitial,activityRegistery,loadLevels} = rootStore.activityStore;
      const { loadCategories } = rootStore.categoryStore;

      const {setClearedBeforeNewPredicateComing,clearPredicates} = rootStore.blogStore;


      useEffect(() => {
      
          loadActivities();
          loadCategories();
          loadLevels();
      },[loadActivities,loadCategories,loadLevels]); //[] provides the same functionality with componentDidMounth..   dependency array
    
    
        const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  
    return (
      <>
        <Helmet>
        <title>Afitapp - Sağlıklı Aktivite Platformu</title>
      </Helmet>
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
          <p><Button basic className='blueBtn' style={{display:'flex',  alignItems:"flex-end"}} circular onClick={() => {
            setOpen(false);
          //  setPage(0);
            //setProfileFilterForm({...profileFilterForm, categoryId:allCatId});
          //  clearProfileRegistery();
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
          <p><Button basic circular color='blue' style={{display:'flex',  alignItems:"flex-end"}} onClick={() => {
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
            //  setCategoryIds([allCatId]);
            //  setPredicate("categoryIds",allCatId);
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
          <p> <Button basic circular style={{display:'flex',  alignItems:"flex-end"}} color='blue'  onClick={() => {
            setOpen(false);
            setClearedBeforeNewPredicateComing(true);
            clearPredicates(null);
           // rootStore.blogStore.setPredicate('categoryId', allCatId);
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
        <Segment textAlign='center' vertical className='masthead' id="slideImages">
               <Container text>
                   <Header as='h1' inverted>
                    {isMobile ? "Dilediğin kategoride aktivite ara!":"Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!"}   
                   </Header>
                   {/* {isLoggedIn && user && token ? (  */}
                   <Fragment>
                        <ActivitySearchArea />
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
          {/* {isTablet ?
          <>   <Container text className='mobile_text_container'>
                 <Header as='h1'>
                     Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!
                 </Header>
             </Container>
          <Segment textAlign='center' vertical className='masthead' id="slideImages">
 
      </Segment>
      <Fragment>
                      <ActivitySearchArea />
                 </Fragment>
                   </>
      :
      <div className='masthead' id="slideImages" style={{display:"flex", flexDirection:"row", marginTop:"-66px"}}>
         <Container text>
              <Header as='h1'  style={{fontSize: '33px',  textAlign:'center', width:"100%" , textShadow: "1.5px 1.5px #f2f2f2"}}>
                  Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!
              </Header>
               <p style={{ fontSize: '1.3rem', color: "#222E50" }}>
               İhtiyacın olan en doğru uzmanı en kolay şekilde bulabileceğin yerdesin. 
               Yerinde ya da online olarak aktivitelere katılabilir, eğitmenlerin paylaştıkları blogları okuyarak ilgilendiğin alanda bilgi sahibi olabilirsin. 
                </p> 
          </Container>
      </div>
     

          } */}
           
           <Container className="pageContainer home">
           <div style={{height:"20px"}} className="spacingContainer__small" />
           {/* <Header as='h3'  style={{fontSize: '30px',  textAlign:'center', width:"100%" }}>
                Hoşgeldin!
                </Header> */}
          
                <Header as='h1'  style={{fontSize: '30px',  textAlign:'center', width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
                 Doğru uzmanı ve doğru aktiviteyi AfitApp ile keşfet! 
               {/* Yeni aktiviteler yeni insanlar keşfetme zamanı!*/}
                </Header>
              <Grid className="activityListGrid">
              <Grid.Row>
              <Grid.Column width={16}>
              {loadingInitial && page === 0 ? <ActivityListItemPlaceholder/> :
              (
              // <InfiniteScroll
              // pageStart={0}
              // loadMore={handleGetNext}
              // hasMore={!loadingNext && page +1 < totalPages}
              // initialLoad={false}>
              <>
                <ActivityList />
                {activityRegistery.size > 0 && 
                <div style={{display:"flex", justifyContent:"center"}}>
                <Button  
                 floated="right"
                 fluid={isMobile} 
                 size="large" 
                 circular
                 className='orangeBtn'
                 onClick={()=> history.push("/activities")} 
                 style={{margin:"20px 0"}}
               > Daha Fazla Aktivite </Button>
               </div>
                }
                
               </>
             // </InfiniteScroll>
              )}
              
              </Grid.Column>
              <Grid.Column width={4}>
              </Grid.Column>
              <Grid.Column width={12}>
              <br></br>
              <br></br>
              </Grid.Column>
              </Grid.Row>
              </Grid>


              <Grid columns={3} textAlign='center'>

<Grid.Row >
  <Grid.Column width={isMobile ? "16": "5"}>
    <Header as='h3' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} size="small" circular className='orangeIcon' name='calendar check outline' />     
        <Header.Content>
            Aktivite Planla
            <Header.Subheader className="homepage_subheader">
            AFitApp ile uzman danışmanların oluşturmuş olduğu aktivitelere katılabilir, sağlığın için kendine vakit ayırırken aynı zamanda sosyalleşmenin de tadını çıkarabilirsin.  
        </Header.Subheader>
         </Header.Content> 
    </Header>
   
  </Grid.Column>
  <Grid.Column width={isMobile ? "16": "5"} >
    <Header as='h3' icon>
        <Icon style={{fontSize:"1.5rem",marginBottom:"15px"}} circular className='orangeIcon' flipped='horizontally' name='history' />
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
        <Icon style={{fontSize:"1.5rem", marginBottom:"15px"}} size="small" circular className='orangeIcon' name='heart' />
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
           {/* <Grid stackable >
        <Grid.Column width={16}>
          <Header
            floated='left'
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
                </Card.Content>
            </Card>
            <Card className="diyetCard homepageCatCard" onClick={() => {
                setAllCatId("baed526c-a3cb-4d60-8ac7-98030112613a");
                setOpen(true);
                setTitle("Diyet");
                }} >
                <Card.Content>
                    <Card.Header>Diyet</Card.Header>
                     <Label content="110 Uzman & Aktivite"/> 
                </Card.Content>
            </Card>
            <Card className="meditasyonCard homepageCatCard" onClick={() => {
                setAllCatId("a5ffd0ff-c1f5-4979-84eb-3688daaca8a3");
                setOpen(true);
                setTitle("Meditasyon");
                }} >
                <Card.Content>
                    <Card.Header>Meditasyon</Card.Header>
                    <Label content="Uzman & Aktivite"/> 
                </Card.Content>
            </Card>
            
            <Card className="psikologCard homepageCatCard" onClick={() => {
                setAllCatId("cc6989f7-fa27-4aad-b4b7-fc1bbaf0a7b4");
                setOpen(true);
                setTitle("Psikoloji");
                }} >
                <Card.Content>
                    <Card.Header>Psikoloji</Card.Header>
                </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid> */}
      <div className="spacingContainer__small" />
{user === null &&
 <Segment clearing secondary className="homepage_contactus-form">
<Grid columns={2} stackable textAlign='left'>
    <Grid.Row verticalAlign='middle' className="contactus-row">
        <Grid.Column>
            <Image src={'/assets/contactus.jpg'} />
        </Grid.Column>
       
        <Grid.Column style={{textAlign:"center"}}>
                <Header as="h1">
                    <Header.Content>Eğitmen misin?</Header.Content>
                </Header>
                <Header.Subheader as="h2" style={{fontSize:"1.2rem",marginBottom:"20px", fontWeight:"500"}}>
                      <div>AFitApp'da uzman olduğun alanda aktivite planlamak ve erişilebilirliğini arttırmak için buradan başvurabilirsin.
                        </div>  
                            <div>
                            <Button  
                            primary
                            circular
                            disabled={loading}
                            style={{ marginTop:"20px"}} 
                            onClick={()=>{history.push('/trainerOnboarding');}}
                            >
                          Uzman Başvuru Formu 
                        </Button>
                            </div>
                </Header.Subheader>
        </Grid.Column>

        </Grid.Row>
        </Grid>
        </Segment> }
    <div style={{display:"flex"}}>
        <div className="spacingContainer__small" />
    </div>
<br/>

    
      </Container>
        </Fragment>
    </>
    );
};
export default observer(HomePage)