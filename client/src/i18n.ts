import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
 // .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          mainTitle: "Search for healty memories you'll never forget!",
          langLabel: "Language",
          activities: "Activities",
          trainers: "Trainers",
          blogs:"Blogs",
          mainTitleMobile:"Search for healty activities",
          search:"Search",
          showMore:"Show more",
          trainerApplication:"Apply as trainer",
          login:"Log in",
          signup:"Sign up",
          categorySearch:"Category",
          supplierTitle:"Would you like to be a supplier?",
          getStarted:"Get started free",
          trainerInvite:"We’ll ask for some simple contact and company details, such as which products your business offers.",
          aboutUs:"About us",
          contact:"Contact",
          faq:"FAQ",
          loading:"Loading",
          loggingOut:"Logging out",
          welcomeCookie:"We use cookies to give you the best possible service. If you continue browsing, you agree to the use of cookies. More details can be found in our ",
          privacyPolicy:"Privacy Policy",
          cookiePolicy:"Cookies"
        },
      },
      tr: {
        translation: {
          mainTitle: "Dilediğin kategoride aktivite ara, sağlıklı sosyalleşmenin tadını çıkar!",
          langLabel: "Dil",
          activities: "Aktiviteler",
          trainers: "Uzmanlar",
          blogs:"Blogs",
          mainTitleMobile:"Dilediğin kategoride aktivite ara!",
          search:"Ara",
          showMore:"Daha fazla aktivite",
          trainerApplication:"Uzman Başvurusu",
          login:"Giris Yap",
          signup:"Kaydol",
          categorySearch:"Kategori..",
          supplierTitle:"Eğitmen misin?",
          getStarted:"Basvur",
          trainerInvite:"Afitapp'da uzman olduğun alanda aktivite planlamak ve erişilebilirliğini arttırmak için buradan başvurabilirsin.",
          aboutUs:"Hakkımızda",
          contact:"İletişim",
          faq:"Sıkça Sorulan Sorular",
          loading:"Yükleniyor",
          loggingOut:"Çıkış yapılıyor...",
          welcomeCookie:"Size daha iyi hizmet sunabilmek için çerezler kullanıyoruz. Detaylı bilgi için",
          cookiePolicy:"Çerez Politikası",
          privacyPolicy:"Kişisel Verilerin Korunması"
        },
      }
     
    },
  });

export default i18n;