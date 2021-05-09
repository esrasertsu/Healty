import React,  { useEffect, useContext, useState}  from 'react';
import { Button, Card, Grid, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import InfiniteScroll from 'react-infinite-scroller';
import BlogFilters from './BlogFilters';
import BlogMainPageItemsPlaceholder from './BlogMainPageItemsPlaceholder';
import BlogListItem from './BlogListItem';



const BlogList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {getBlogsByDate,loadBlogs, loadingPosts, setPage, page, totalPages} = rootStore.blogStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadBlogs().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadBlogs();
  },[loadBlogs]); //[] provides the same functionality with componentDidMounth..   dependency array

  return (
    <>
    <Grid className="blogPageGrid">
      <Grid.Row>
      <Grid.Column width={4}>              
      <BlogFilters />
      </Grid.Column>
      <Grid.Column width={12}>
      {
      loadingPosts && page === 0?
       <BlogMainPageItemsPlaceholder /> :
        <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page +1 < totalPages}
        initialLoad={false}>
          <Card.Group stackable>
              {
                getBlogsByDate.map((blog) => (
                  <BlogListItem key={blog!.id} blog={blog} />
                ))
              }
            </Card.Group>
            </InfiniteScroll>
          }        
        </Grid.Column>
    </Grid.Row>
    </Grid>
    <br></br>
      <br></br>
    </>
  );
};

export default observer(BlogList)