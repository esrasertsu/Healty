import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import { observer } from 'mobx-react-lite';
import { Route , RouteComponentProps, Switch, withRouter} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { LoginForm } from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { LoadingComponent } from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage  from '../../features/profiles/ProfilePage';
import ProfileList  from '../../features/profiles/ProfileList';
import ActivitySearchPage from '../../features/activities/search/ActivitySearchPage';
import PostForm from '../../features/posts/PostForm';
import BlogList from '../../features/blog/BlogList';
import Footer from '../../features/home/Footer';
import BlogPage from '../../features/blog/BlogPage';
import MessagesPage from '../../features/messages/MessagesPage';

const App: React.FC<RouteComponentProps> = ({location}) => {

  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded,setActiveMenu } = rootStore.commonStore;
  const { getUser,user,createHubConnection,hubConnection } = rootStore.userStore;


  // useEffect(() => {
  //   return history.listen((location) => { 
  //     if(location.pathname === "/profiles")
  //        setActiveMenu(0);

  //      console.log(`You changed the page to: ${location.pathname}`) 
  //   }) 
  // },[history]) 

  useEffect(() => {
    if(token) {
      getUser().finally(() => setAppLoaded())
    }else {
      setAppLoaded()
    }
  },[getUser, setAppLoaded, token])

  if(!appLoaded) return <LoadingComponent content='Loading app...' />

  if(appLoaded && user!==null && hubConnection === null)
    createHubConnection();

    return (
       <Fragment>
         <ModalContainer />
         <ToastContainer position= 'bottom-right' />
         <NavBar/>
         <Route exact path="/" component={HomePage} />
         <Route path={'/(.+)'} render={()=>(
           <Fragment>
              <Container className="pageContainer">
                <Switch>
                  <Route exact path="/activities" component={ActivityDashboard} />
                  <Route path="/activities/:id" component={ActivityDetails} />
                  <Route exact path="/blog" component={BlogList} />
                  <Route exact path="/blog/:id" component={BlogPage} />
                  <Route key={location.key} path={["/createActivity", "/manage/:id"]} component={ActivityForm} />
                  <Route key={location.key} path={["/createPost", "/manage/:id"]} component={PostForm} />
                  <Route path="/profile/:username" component={ProfilePage}/>
                  <Route path="/profiles" component={ProfileList}/>
                  <Route path="/messages" component={MessagesPage}/>
                  <Route path="/login" component={LoginForm}/>
                  <Route exact path="/activitysearch" component={ActivitySearchPage}/>
                  <Route component={NotFound}/>
                </Switch>
              </Container>
           </Fragment>
         )} />
                
{/*   <Footer /> */}
        </Fragment>    
    );
};

export default withRouter(observer(App));
