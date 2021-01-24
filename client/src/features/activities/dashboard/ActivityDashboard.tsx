import React,  { useEffect, useContext}  from 'react';
import { Button, Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {history} from '../../../index'

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial} = rootStore.activityStore;

  useEffect(() => {
    loadActivities();
  },[loadActivities]); //[] provides the same functionality with componentDidMounth..   dependency array

  if(loadingInitial) return <LoadingComponent content='Loading Activities'/>

  return (
    <Grid>
      <Grid.Row>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
      <Button
                        onClick={() => history.push('/activitysearch')}
                        floated="right"
                        content="Map View"
                        color="yellow"
                        />
      </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(ActivityDashboard)