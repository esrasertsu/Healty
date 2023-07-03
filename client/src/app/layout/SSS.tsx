import React, { Fragment} from 'react'
import {  Container, Header, Segment, List } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet-async';

  
 const ContactUs = () => {
   

  return (

    <Fragment>
         <Helmet>
        <title>Afitapp - Sıkça Sorulan Sorular</title>
      </Helmet>
    <Segment textAlign='center' vertical className='masthead' id="slideImages" style={{height:"20vh"}}>
              <Header as='h1' inverted textAlign='center' style={{margin:"auto"}}>
                FAQ
               </Header>
       </Segment>
       <div style={{height:"50px"}} className="spacingContainer__small" />

       <Container className="pageContainer home" style={{textAlign:'left'}}>
       <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
       Afitapp nedir?
            </Header>

            <p>
            Spor, diyet, meditasyon ve psikoloji kategorilerinde ihtiyacınız olan en doğru uzmanlara, en eğlenceli ve faydalı aktivitelere en kolay şekilde erişebileceğiniz bir sağlıklı yaşam platformudur.
           </p>

            <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
            Ne tür aktiviteler var?
            </Header>
            <p>
                Tenis, fitness, nefes terapisi, meditasyon, yoga, yelken, pilates gibi bir çok alanda <b>yüzyüze ve online</b> olarak açılmış sağlıklı aktivitelere <b>Aktiviteler</b> sekmesi altında, filtreler sayesinde size en uygun olanı  bulup katılabilirsiniz.
           </p>
           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Uzmanları nasıl bir değerlendirmeden geçiriyorsunuz?
            </Header>
            <p>
              <a href="/trainerOnboarding" target="_blank">Uzman Başvuru Formu</a>'nu dolduran uzmanlarımız gerçek iletişim bilgileri, uzmanlık alanındaki tecrübelerini ve yetkinlik belgelerini bizimle paylaşarak platforma dahil olmaktadır.
           </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Ödemeyi nasıl yapacağım? Güvenli midir?
            </Header>
            <p>
            Kredi kartınızla güvenli bir şekilde ödemenizi yapabilirsiniz. Ödeme altyapımız, Türkiye'nin birçok e-ticaret platformunda yüksek güvenilirliği ile bilinen ve kullanılan IYZICO tarafından sağlanmıştır.
           </p>
           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
            Kredi kartı bilgilerim güvende midir?
            </Header>
            <p>
            Afitapp.com olarak, kredi kartı bilgileriniz tarafımızda kesinlikle saklanmamaktadır. Ödeme anında, şifreli bir şekilde Iyzico'ya aktarılır ve bankanızın 3D güvenlik kriterlerine uygun şekilde ödemeniz gerçekleşir.
           </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Rezervasyon işlemini nasıl yapabilirim?
           </Header>
           <p>
               Sadece 2 tık ile rezervasyonunuzu (satın alma) işleminizi gerçekleştirebilirsiniz:
               <List as="ol" style={{margin:"10px 0"}}>
                   <List.Item as='li' value='*' >
                    Aktivitelerden rezervasyon yapmak istediğiniz (bilet satın almak istediğinz) ürünün sayfasında yer alan ”Rezervasyon Yap” adımını kişi sayısı girerek seçin.
                   </List.Item>
                   <List.Item as='li' value='*' >
                    Bilgi girişi sayfasında, “ad, soyad, cep telefonu ve e-posta” bilgileriyle ödeme aşamasına geçin.
                   </List.Item>
                   <List.Item as='li' value='*'>
                   Ödeme sayfasında kredi kartı bilgilerinizi girerek rezervasyonunuzu tamamlayın.
                   </List.Item>
                   <List.Item as='li' value='*'>
                   Hizmet sağlayıcımız, en kısa sürede rezervasyonunuzu onaylayacaktır ve belirttiğiniz e-posta adresine, rezervasyon numaranızla beraber onay mesajı iletilecektir.
                   </List.Item>
               </List>
                Not: Sadece sistemimize üye olan kullanıcılar rezervasyon gerçekleştirebilmektedir.
           </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Rezervasyon yapacağım ama size sormak istediğim bazı sorular var. Ne yapabilirim?
           </Header>
           <p>
           Ürün detaylarını ve sıkça sorulan soruları okudunuz ama yanıtlarınızı bulamadığınız sorularınız var ise;
            bize aklınıza takılan tüm soruları sorabilirsiniz. <b>info@afitapp.com</b> adresimize e-posta göndererek veya iletişim bölümündeki telefon numaramızı arayarak sorularınızı iletin. En kısa zamanda size geri dönüş yapacağız.
           </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Nasıl üye olabilirim?
           </Header>
           <p>
           Anasayfa sağ üst köşede yer alan “Kayıt Ol” adımından; e-posta, kullanıcı adı, ad soyad ve şifrenizi girerek kolayca kayıt olabilirsiniz. Email adresinize gelecek olan doğrulama mailini onaylamanız gerekmektedir. (Spam kutunuzu da kontrol etmeyi unutmayın)
            </p>
            <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Hem uzman hem de normal üye başvurusu yapabilir miyim?
           </Header>
           <p>
              <b>Uzman Başvuru Formu</b> ile sisteme giriş yapan tüm uzmanlarımız diğer üyeler gibi aktivitelere katılabilir, kendi açmış oldukları aktivitelerin detaylarını <b>Aktivitelerim</b> sekmesi altından,
              katılmış oldukları aktivitelerin ödeme detaylarını ise <b>Rezervasyonlarım</b> sekmesi altından görüntüleyebilirler.

            </p>
            <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
            Rezervasyonlarımı nasıl görüntüleyebilirim?
           </Header>
           <p>
           Anasayfa sağ üst köşede yer alan “Giriş Yap” adımından, e-posta ve şifrenizi girerek, Rezervasyonlarım sayfanızdan tüm rezervasyon bilgilerinizi görüntüleyebilirsiniz.
           </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Rezervasyonumu iptal etmek istiyorum. Nasıl yapabilirim?
           </Header>
           <p>
           Rezervasyonunuzu iptal etmek için; anasayfa sağ üst köşede yer alan “Giriş” adımından, e-posta ve şifrenizi girerek, <p>Rezervasyonlarım</p> sayfanıza giriş yapın. Eğer rezervasyonunuzun tarihi geçmemiş ise veya son 24 saate girilmemiş ise; ”İptal Et” tuşuna basarak rezervasyon iptalinizi gerçekleştirebilirsiniz.   </p>

           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Rezervasyonumu iptal edeceğim, iade alabilir miyim?
           </Header>
           <p>
           Rezervasyon yaptırdığınız aktivite tarihine 24 saat kalaya kadar kesintisiz iadeli olarak rezervasyonunuzu iptal edebilirsiniz.
           </p>
           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           İptal/İade koşullarına uymadığı için iade talebim reddedildi. Ne yapabilirim?

           </Header>
           <p>
           Gümrük ve Ticaret Bakanlığı'nın “Mesafeli Sözleşmeler Yönetmeliği”ne (madde 15 - g başlığı) göre iade hakkınız bulunmamaktadır. Lütfen rezervasyon yaptığınız iletişim adresi üzerinden info@afitapp.com e-posta adresine, rezervasyon numaranız ve talebinizle beraber bize bildirin. Size yardımcı olmak için elimizden ne geliyorsa yapacağımızdan emin olabilirsiniz.           </p>


           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Rezervasyonumda kişi sayısını arttırmak istiyorum. Ne yapmam gerekir?

           </Header>
           <p>
             Rezervasyonunuzu hemen iptal edip yenisini alabilirsiniz. İptal durumunda iade edilecek paranın hesabınıza geçmesi bankanıza göre değişiklik gösterebilmektedir. 
           </p>
           <Header as='h2'  style={{fontSize:"22px",width:"100%",textShadow: "1.5px 1.5px #f2f2f2", marginBottom:"20px" }}>
           Yorum ve puanlamayı nereden yapabilirim?

           </Header>
           <p>
           Tebrikler! Umarız aktivitenizden memnun kalmışsınızdır. Görüşleriniz bizim için çok önemli. 
           Rezervasyonunuzla ve/veya uzmanınızla ilgili duygu, düşüncelerinizi bizlerle ve diğer tüm katılımcılarla paylaşmak için yorum yazabilir veya 5 üzerinden puan verebilirsiniz. 
           Uzman değerlendirme için; anasayfa sağ üst köşede yer alan ”Giriş Yap” adımından, e - posta ve şifrenizi girerek, Rezervasyonlarım sayfanıza giriş yapın. 
           Tamamlanmış aktivitelerinizin sayfasında yer alan ”Değerlendirme Formunu” doldurarak görüşlerinizi bize iletebilirsiniz.</p>

        <div style={{height:"40px"}} className="spacingContainer__small" />
            
        <div style={{display:"flex"}}>
            <div className="spacingContainer__small" />
        </div>
        <br/>


  </Container>
    </Fragment>
        );
}


export default observer(ContactUs);