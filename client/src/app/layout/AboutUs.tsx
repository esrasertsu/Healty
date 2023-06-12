import React, { Fragment, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Header, Segment, Image, Grid, Icon, Modal } from 'semantic-ui-react'
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/rootStore';

 const AboutUs = () => {

    const history = useHistory();
    const isTablet = useMediaQuery({ query: '(max-width: 767px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const rootStore = useStore();
    const {isLoggedIn, user} = rootStore.userStore;

  return (

    <Fragment>
          <Helmet>
        <title>Afitapp - Hakkımızda</title>
      </Helmet>
    <Segment textAlign='center' vertical className='masthead' id="slideImages" style={{height:"20vh"}}>
              <Header as='h1' inverted textAlign='center' style={{margin:"auto"}}>
                Hakkımızda
               </Header>
       </Segment>
      
       
       <Container className="pageContainer home">
       <div style={{height:"20px"}} className="spacingContainer__small" />
     
       <Header as='h1'  style={{textAlign:'center', width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
            Sağlıklı aktiviteler keşfetme zamanı!
           {/* Yeni aktiviteler yeni insanlar keşfetme zamanı!*/}
            </Header>

            <p>
                Covid-19 ile birlikte hayatımıza giren kısıtlamalardan sıkıldığımız, sosyalleşirken tedirgin olduğumuz ve sağlıklı yaşamanın değerini daha çok anladığımız bu dönemde
                Afitapp ekibi olarak sizlere alanında uzman kişiler ile sağlıklı aktiviteler ulaştırabileceğimiz bir platform oluşturduk.
            </p>
            <p> 
         Spor koçundan diyetisyene, meditasyon eğitmeninden psikoloğa ihtiyacınız olan en doğru uzmanlara en kolay şekilde erişebileceğiniz bir ortam yaratarak Türkiye'nin en büyük
           sağlıklı yaşam platformu olma hedefiyle sizlere en iyi hizmeti sağlamak için tüm gücümüzle çalışmaya devam ediyoruz.
          </p>
          <p>
            Aradığınız lokasyonda ya da online olarak alanında uzman kişilerin düzenlediği sağlıklı aktivitelere katılabilir, uzman eğitmenlerin paylaştıkları blogları okuyarak merak ettiğiniz konularda bilgi sahibi olabilirsiniz. 
            Uzman eğitmenleri ve düzenlenen aktiviteleri değerlendirerek Afitapp'ın diğer kullanıcılarına tavsiyelerde bulunabilir, eğitmenlerle direkt iletişime geçerek vakit kaybetmeden merak ettiklerinizi öğrenebilirsiniz.
          </p>
               
            <p>Afitapp ekibi olarak sağlıklı yaşama dair aradığınız herşeyi en hızlı şekilde bulmanızı sağlayacak hizmetlerimizle sizin her zaman yanınızdayız!</p>
            
            {/* <Container text className='mobile_text_container' >
                 <Header as='h1' style={{fontSize: '30px'}}>
                     Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!
                 </Header>
             </Container> */}

<div style={{height:"40px"}} className="spacingContainer__small" />

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


export default observer(AboutUs);