import React, { useEffect, Fragment, useContext} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';
import { Route , RouteComponentProps, withRouter, Switch} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
    const activityStore = useContext(ActivityStore);


    useEffect(() => {
      activityStore.loadActivities();
    },[activityStore]); //[] provides the same functionality with componentDidMounth..   dependency array

    if(activityStore.loadingInitial) return <LoadingComponent content='Loading Activities'/>

    return (
       <Fragment>
          <NavBar/>
          <Container style={{ marginTop: "5em" }}>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/createActivity" component={ActivityForm} />
              <Route exact path="/" component={HomePage} />
          </Container>
        </Fragment>    
    );
    
  
};

export default withRouter(observer(App));
