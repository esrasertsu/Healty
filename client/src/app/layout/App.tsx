import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Container, Icon, Image, Menu, Modal, Segment, Sidebar } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import { observer } from 'mobx-react-lite';
import { Redirect, Route , RouteComponentProps,Switch, withRouter} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import KVKKContract from '../../features/home/KVKKContract';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { toast, ToastContainer } from 'react-toastify';
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { LoadingComponent } from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage  from '../../features/profiles/ProfilePage';
import ProfileDashboard  from '../../features/profiles/ProfileDashboard';
import PostForm from '../../features/posts/PostForm';
import BlogList from '../../features/blog/BlogList';
import BlogPage from '../../features/blog/BlogPage';
import MessagesPage from '../../features/messages/MessagesPage';
// import { useLoadScript } from "@react-google-maps/api";
// import { LoadScriptUrlOptions } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { runInAction } from 'mobx';
import PrivateRoute from './PrivateRoute';
import  LoginRequiredPage  from './LoginRequiredPage';
import  Admin  from '../../features/admin/Admin';
import { useMediaQuery } from 'react-responsive'
import MobileNavBar from '../../features/nav/MobileNavBar';
import MobileNavMenu from '../../features/nav/MobileNavMenu';
import ActivityPaymentPage from '../../features/activities/payment/ActivityPaymentPage';
import Footer from '../../features/home/Footer';
import { history } from '../../index';
import RegisterSuccess from '../../features/user/RegisterSuccess';
import VerifyEmail from '../../features/user/VerifyEmail';
import ResetPassword from '../../features/user/ResetPassword';
import { IUser } from '../models/user';
import SubMerchantDetails from '../../features/subMerchant/SubMerchantDetails';
import Settings from '../../features/user/Settings';
import PaymentSuccessPage from '../../features/activities/payment/PaymentSuccessPage';
import PaymentErrorPage from '../../features/activities/payment/PaymentErrorPage';
import OrderList from '../../features/orders/OrderList';
import OrderItemDetail  from '../../features/orders/OrderItemDetail';
import TrainerForm from '../../features/user/TrainerRegisterModal';
import TrainerOnboardingPage from '../../features/user/TrainerOnboardingPage';
import TrainerRegisterPage from '../../features/user/TrainerRegisterPage';
import { AnalyticsWrapper, UseAnalytics } from '../common/util/util';
import Forbidden from './Forbidden';
import ReadyOnlyApplication from '../../features/user/ReadyOnlyApplication';
import MainVideoPage from '../../features/videoCall/MainVideoPage';
import SavedPage from '../../features/savedItems/SavedPage';
import ActivitySuccessPage from '../../features/activities/form/ActivitySuccessPage';
import TrainerActivityPage from '../../features/activities/personalDashboard/TrainerActivityPage';
import ResponsiveContainer from './theme/ResponsiveContainer';
import KullanimSartlari from '../../features/home/KullanimSartlari';
import MembershipContract from '../../features/home/MembershipContract';


// const libraries = ["places"] as LoadScriptUrlOptions["libraries"];

const App: React.FC<RouteComponentProps> = ({location}) => {

  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded,loadCities} = rootStore.commonStore;
  const { getUser,user,createHubConnection,isLoggedIn,stopHubConnection ,loggingOut} = rootStore.userStore;
  const { loadCategories} = rootStore.categoryStore;
  const { modal, openModal, closeModal} = rootStore.modalStore;
  const { activity,attendActivity} = rootStore.activityStore;
  const initialized = UseAnalytics();

  // useLoadScript({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  //     libraries
  // });
  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
   // return history.listen((location) => { 
    //   if(location.pathname === "/profiles")
    //    toast.success("Değişti")

    //    console.log(`You changed the page to: ${location.pathname}`) 
    // }) 
    document.querySelector('body')!.scrollTo(0,0)
  },[history,location.pathname]) 
  
  const alertUser = async (event:any) => {

    await stopHubConnection();
     runInAction(() => {
         event.preventDefault()
         event.returnValue = ''
       
    }
     )
     
 }

 const handleLoginClick = (e:any,str:string) => {
  e.stopPropagation();
  if(modal.open) closeModal();

      openModal("Giriş Yap", <>
      <Image  size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
      <Modal.Description className="loginreg">
      <LoginForm location={str} />
      </Modal.Description>
      </>,true,
      "","blurring",true) 
  }
 
 const handlePaySubmit = (e:any) => {
  if(!isLoggedIn && activity)
      {    
        var str = `/payment/activity/${activity.id}/1`; 

          handleLoginClick(e,str); 
      }
else
{
  if(activity && activity.price && activity.price > 0 )
  {    
      var str = `/payment/activity/${activity.id}/1`; 
      history.push(str);

  }
  else
  {
    activity && attendActivity();
  }
}
}



//  const handleLoginClick = () => {
//   if(modal.open) closeModal();
//       openModal("Giriş Yap", <>
//       <Image size={isMobile ? 'big': isTablet ? 'medium' :'large'}  src='/assets/Login1.jpg' wrapped />
//       <Modal.Description className="loginreg">
//       <LoginForm location={location.pathname} />
//       </Modal.Description>
//       </>,true,
//      "","",false) 
//   }

  useEffect(() => {
      if(token)
      {
        getUser().then((res) => {
          if(res){
            window.addEventListener('beforeunload', alertUser);
            createHubConnection(true)
            .finally(() => 
           {
              loadCities().then(()=>
                 runInAction(() => {
                  loadCategories();
                  setAppLoaded();
                }));
            }
          );
          }else{
            loadCities().then(()=>
            runInAction(() => {
             loadCategories();
             setAppLoaded();
           }));
           
          }
          }
          )
      }else{
        loadCities().then(()=>
        runInAction(() => {
         loadCategories();
         setAppLoaded();
       }));
      }
       
    return () => {
      if(user)
      window.removeEventListener('beforeunload', alertUser)
    }
  },[])

  // useEffect(() => {
  //   if(appLoaded && user!==null && hubConnection === null)
  //   {
  //     debugger;
  //     createHubConnection(true);

  //   }

  // }, [appLoaded,user])

  // useEffect(() => {
  //   loadCities().then(()=>
  //   runInAction(() => {
  //     setAppLoaded();
  //     loadCategories();
  //   })
  //   );
  
  // }, [])


  // useEffect(() => {
  //   debugger;
  //   if (token) {
  //     getUser().finally(() => setAppLoaded())
  //   } else {
  //     setAppLoaded();
  //   }
  // }, [getUser, setAppLoaded, token])


  if(!appLoaded) return <LoadingComponent content='Yükleniyor...' />
  if(loggingOut) return <LoadingComponent content='Çıkış yapılıyor...' />
  const reload = () => window.location.reload();
    
  return (
      <AnalyticsWrapper initialized={initialized}>

       <Fragment>
         <ModalContainer />
         <ToastContainer position= 'bottom-right' />
         <ResponsiveContainer>         
         <>
        <Route exact path="/" component={HomePage} />
        <Route path={'/(.+)'} render={()=>(
          <Fragment>
             <Switch> 
             <Route path="/uyelik_ve_gizlilik_sozlesmesi" component={MembershipContract}/>
                <Route path="/kisisel_verilerin_korunmasi" component={KVKKContract}/>
                <Route path="/kullanim_sartlari" component={KullanimSartlari}/>
                 <Route path="/profiles" component={ProfileDashboard}/>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <PrivateRoute  path="/payment/activity/:id/:count" component={ActivityPaymentPage} />
                <Route exact path="/blog" component={BlogList} />
                <Route exact path="/blog/:id" component={BlogPage} />
                <PrivateRoute key={location.key} path={["/createActivity", "/manage/:id"]} component={ActivityForm} />
                <PrivateRoute key={location.key} path={["/createPost", "/manage/:id"]} component={PostForm} />
                <Route path="/profile/:username" component={ProfilePage}/>
                <PrivateRoute path="/messages" component={MessagesPage}/>
                <Route path="/login" component={LoginForm}/>
                <Route path="/login-required" component={LoginRequiredPage}/>
                 {/* <Route exact path="/activitysearch" component={ActivitySearchPage}/> */}
                 <Route path="/user/registerSuccess" component={RegisterSuccess}/>
                 <Route path="/activitySuccess" component={ActivitySuccessPage}/>
                 <Route path="/myActivities" component={TrainerActivityPage}/>
                 <Route path="/user/verifyEmail" component={VerifyEmail}/>
                 <Route path="/user/resetPassword" component={ResetPassword}/>
                 <Route path="/TrainerOnboarding" component={TrainerOnboardingPage} />
                 <PrivateRoute path="/TrainerRegister/:id" component={TrainerRegisterPage} />
                 <PrivateRoute path="/settings" component={Settings}/>
                 <PrivateRoute exact path="/payment/success" component={PaymentSuccessPage} />
                 <PrivateRoute exact path="/payment/error" component={PaymentErrorPage} />
                 <Route exact path="/orders" component={OrderList}/>
                 <PrivateRoute exact path="/orders/:id" component={OrderItemDetail}/>
                 <PrivateRoute exact path="/videoMeeting/:id" component={MainVideoPage}/>
                 <Route exact path="/admin" component={Admin}/>
                 <Route exact path="/forbidden" component={Forbidden}/>
                 <PrivateRoute path="/saved" component={SavedPage}/>
                 <Route component={NotFound}/>
              </Switch>
          </Fragment>
        )} />

        </>
        <Footer /> 

      </ResponsiveContainer>  
      {
        isMobile && history.location.pathname.includes("/activities/") && activity && !activity.isGoing && !activity.isHost &&
        <div className='stickyButton'>
          <Button circular  className='orangeBtn' onClick ={handlePaySubmit}
                       content={activity.price && activity.price > 0 ? 'Rezervasyon Yap': 'Rezervasyonu Tamamla'}></Button>

        {/* <a aria-current="page" className="ui teal button active" role="button" href="https://react.semantic-ui.com/layouts">
          <i aria-hidden="true" className="left arrow icon"></i>Layouts
      </a>
          <a target="_blank" className="ui secondary button" role="button" href="https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/HomepageLayout.js">
            <i aria-hidden="true" className="github icon"></i>Source 
            </a>*/}
       </div>
      }       
     
        </Fragment>
        </AnalyticsWrapper>
    
    );
};

export default withRouter(observer(App));
