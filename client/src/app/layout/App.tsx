import React, { useEffect, Fragment, useContext} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

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
          <ActivityDashboard />
        </Container>
      </Fragment>
    );
    
  
}

export default observer(App);
