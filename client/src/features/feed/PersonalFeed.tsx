import React,  { useEffect, useContext, useState}  from 'react';
import { Button, Grid, Icon, Loader } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import InfiniteScroll from 'react-infinite-scroller';
import { Feed } from 'semantic-ui-react'

const events = [
  {
    date: '1 Hour Ago',
    image: '/assets/user.png',
    meta: '4 Likes',
    summary: 'Elliot Fu added you as a friend',
  },
  {
    date: '4 days ago',
    image: '/assets/user.png',
    meta: '1 Like',
    summary: 'Helen Troy added 2 new illustrations',
    extraImages: [
      '/assets/categoryImages/psikolog.jpg',
      '/assets/categoryImages/spor.jpg',
    ],
  },
  {
    date: '3 days ago',
    image: '/assets/user.png',
    meta: '8 Likes',
    summary: 'Joe Henderson posted on his page',
    extraText:
      "Ours is a life of constant reruns. We're always circling back to where we'd we started.",
  },
  {
    date: '4 days ago',
    image: '/assets/user.png',
    meta: '41 Likes',
    summary: 'Justen Kitsune added 2 new photos of you',
    extraText:
      'Look at these fun pics I found from a few years ago. Good times.',
    extraImages: [
        '/assets/categoryImages/meditasyon.jpg',
        '/assets/categoryImages/diyetisyenn.jpg',
    ],
  },
  {
    date: '4 days ago',
    image: '/assets/user.png',
    meta: '1 Like',
    summary: 'Helen Troy added 2 new illustrations',
    extraImages: [
      '/assets/categoryImages/psikolog.jpg',
      '/assets/categoryImages/spor.jpg',
    ],
  },
  {
    date: '3 days ago',
    image: '/assets/user.png',
    meta: '8 Likes',
    summary: 'Joe Henderson posted on his page',
    extraText:
      "Ours is a life of constant reruns. We're always circling back to where we'd we started.",
  },
  {
    date: '4 days ago',
    image: '/assets/user.png',
    meta: '41 Likes',
    summary: 'Justen Kitsune added 2 new photos of you',
    extraText:
      'Look at these fun pics I found from a few years ago. Good times.',
    extraImages: [
        '/assets/categoryImages/meditasyon.jpg',
        '/assets/categoryImages/diyetisyenn.jpg',
    ],
  },
]

const PersonalFeed: React.FC = () => {
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
      return <LoadingComponent content='Loading Your Personal Feed'/>

  return (
    <>
    <Grid>
      <Grid.Row>
      <Grid.Column width={12}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page +1 < totalPages}
          initialLoad={false}>
          <Feed events={events} />
        </InfiniteScroll>
        </Grid.Column>
    </Grid.Row>
    </Grid>
    </>
  );
};

export default observer(PersonalFeed)