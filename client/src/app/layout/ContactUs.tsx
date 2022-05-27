import React, { Fragment, ReactElement, useContext, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async';
import { Button, Container, Header, Segment, Image, Grid, Icon, Modal } from 'semantic-ui-react'
import { useMediaQuery } from 'react-responsive';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';

  
 const ContactUs = () => {
  const history = useHistory();

    const isTablet = useMediaQuery({ query: '(max-width: 767px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const zoom = 4;


    const containerStyle = {
        width: '100%',
        height: '400px'
      };
      const center = {
        lat: 41.03017595502739,
        lng: 29.03221315343549
      };

      const position = {
        lat: 41.03017595502739,
        lng: 29.03221315343549
      };

      const onLoad =( marker:any) => {
        console.log('marker: ', marker)
      }
      
  return (

    <Fragment>
         <Helmet>
        <title>Afitapp - Bizimle İletişime Geçin</title>
      </Helmet>
    <Segment textAlign='center' vertical className='masthead' id="slideImages" style={{height:"20vh"}}>
              <Header as='h1' inverted textAlign='center' style={{margin:"auto"}}>
                İletişim
               </Header>
       </Segment>
      
       
       <Container className="pageContainer home">
       <div style={{height:"20px"}} className="spacingContainer__small" />
     
         <Header as='h1'  style={{textAlign:'center', width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
            Bizimle iletişime geçin
           {/* Yeni aktiviteler yeni insanlar keşfetme zamanı!*/}
            </Header>

            <h3>Netsus Bilişim Yazılım Teknolojileri LTD. </h3>
            <p>VKN: 6311598128</p>
            <a href="mailto:info@afitapp.com" >
                <p>info@afitapp.com</p>
            </a>
            &nbsp;
            <p> Adres: İcadiye Mah. Dündar Sk. Canlar Konağı No: 19 İç Kapı No: 1 ÜSKÜDAR/ İSTANBUL</p>
            <div style={{height:"40px"}} className="spacingContainer__small" />

         <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}
            >
                <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                >
                { /* Child components, such as markers, info windows, etc. */ }
                <>
                <Marker
                onLoad={onLoad}
                position={position}
                />
                </>
                </GoogleMap>
            </LoadScript>
      
          

            
            {/* <Container text className='mobile_text_container' >
                 <Header as='h1' style={{fontSize: '30px'}}>
                     Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!
                 </Header>
             </Container> */}

<div style={{height:"40px"}} className="spacingContainer__small" />
      
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
        );
}


export default observer(ContactUs);