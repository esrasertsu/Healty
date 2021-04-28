import React,  { useEffect, useContext, useState}  from 'react';
import { Button, Grid, Icon, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {history} from '../../../index';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import NavBar from '../../nav/NavBar';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadActivities().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadActivities();
  },[loadActivities]); //[] provides the same functionality with componentDidMounth..   dependency array

  if(loadingInitial && page === 0) 
      return <LoadingComponent content='Loading Activities'/>

  return (
    <>
    <NavBar />
    <Grid>
      <Grid.Row>
      <Grid.Column width={4}>
      <Button
                        onClick={() => history.push('/activitysearch')}
                        floated="right"
                        style={{backgroundColor:"#F76425", color:"white"}}
                        >Map View&nbsp;&nbsp;<Icon name="map marker alternate"/> </Button>
                        <br></br>
      <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={12}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page +1 < totalPages}
          initialLoad={false}>
           <ActivityList />
        </InfiniteScroll>
        {/* <Button 
        floated='right'
        content='More...'
        positive
        onClick={handleGetNext}
        loading={loadingNext}
        disabled={totalPages === page +1}
        /> */}
      </Grid.Column>
      <Grid.Column width={4}>
      </Grid.Column>
      <Grid.Column width={12}>
        <br></br>
        <br></br>
        <Loader active={loadingNext} />
      </Grid.Column>
      </Grid.Row>
    </Grid>
    </>
  );
};

export default observer(ActivityDashboard)