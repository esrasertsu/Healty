import React,  { useEffect, useContext, useState}  from 'react';
import { Grid, Icon, Label, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadActivities().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadActivities()
  },[loadActivities]); //[] provides the same functionality with componentDidMounth..   dependency array

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  // Show button when page is scorlled upto given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsToggleVisible(true);
    } else {
      setIsToggleVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <>
    <Grid>
      <Grid.Row>
      <Grid.Column width={4}>
      {/* <Button
                        onClick={() => history.push('/activitysearch')}
                        floated="right"
                        style={{backgroundColor:"#00b5ad", color:"white"}}
                        >Map View&nbsp;&nbsp;<Icon name="map marker alternate"/> </Button>
                        <br></br>                   */}
                        <br></br> 
      <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={12}>
      {loadingInitial && page === 0 ? <ActivityListItemPlaceholder/> :
      (
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page +1 < totalPages}
          initialLoad={false}>
           <ActivityList />
        </InfiniteScroll>
      )}
        <div className="scroll-to-top">
        {isToggleVisible && 
          <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
            <Icon size="large" name="arrow up"/> 
            <span>Başa dön</span>
          </Label>}
      </div>
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