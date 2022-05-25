import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Placeholder, Container, Grid, Header, List, Icon, Image } from 'semantic-ui-react';

const Footer = () => {
  return (
     <>
    <Segment id="footer" attached='bottom' inverted vertical style={{ padding: '5em 0em 0 0' }}>
      <Container style={{minHeight:"100%", margin:"0 0 3em 0"}}>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Afitapp' />
              <List link inverted>
                <List.Item as='a'  href="/about-us">Hakkımızda</List.Item>
                <List.Item as='a' href="/contact-us">İletişim</List.Item>
                {/* <List.Item as='a'>İş Ortaklarımız</List.Item> */}
                <List.Item as='a' href="/mesafeli_satis">Mesafeli Satış Sözleşmesi</List.Item>
                <List.Item as='a' href="/trainerOnboarding" target="_blank">Uzman Eğitmen Başvurusu</List.Item>
                <List.Item as='a' href="/blog" target="_blank">Blog</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Yardım' />
              <List link inverted>
                <List.Item as='a' href="/sikca-sorulan-sorualar" target="_blank">Sıkça Sorulan Sorular</List.Item>
                <List.Item as='a' href="/kisisel_verilerin_korunmasi">Kişisel Verilerin Korunması</List.Item>
                <List.Item as='a' href="/acik_riza">Açık Rıza Metni</List.Item>
                <List.Item as='a' href="/cerez_politikasi">Çerez Politikası</List.Item>
                <List.Item as='a' href="/kullanim_sartlari">Kullanım Şartları</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Sosyal Medya' />
              <List link inverted horizontal>
                <List.Item as='a' target="_blank" href="https://instagram.com/joinafitapp"><Icon size='large' name="instagram" /> </List.Item>
                <List.Item as='a' target="_blank"><Icon size='large' name="twitter" /></List.Item>
                <List.Item as='a' target="_blank"><Icon size='large' name="facebook" /></List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Güvenli Alışveriş
              </Header>
              <List link inverted horizontal>
                <List.Item className='footer-logo-div iyzico-img'> <Image className='footer-logo' src="/icons/iyzico.png" /> </List.Item>
                <List.Item className='footer-logo-div master-card-img'><Image className='footer-logo' src="/icons/footer-master-card.png" /></List.Item>
                <List.Item className='footer-logo-div visa-img'><Image className='footer-logo' src="/icons/visa-logo.png" /></List.Item>
                <List.Item className='footer-logo-div amex-img'><Image className='footer-logo' src="/icons/footer-amex.png" /></List.Item>
                <List.Item className='footer-logo-div troy-img'><Image className='footer-logo' src="/icons/troy-logo.png" /></List.Item>
              </List>
            </Grid.Column>
            
          </Grid.Row>
        </Grid>
     
      
      </Container>
      <div style={{paddingBottom:"1em",width:"100%", textAlign:"center"}}>
        {'Copyright © '}
            <a color="inherit" href="https://afitapp.com/">
              Afitapp
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </div>
    </Segment>
   
    </>
  );
};
export default Footer;
