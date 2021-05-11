import React,  { useEffect, useContext, useState, Fragment}  from 'react';
import { Button, Card, Grid, Icon, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';
import InfiniteScroll from 'react-infinite-scroller';
import BlogFilters from './BlogFilters';
import BlogMainPageItemsPlaceholder from './BlogMainPageItemsPlaceholder';
import BlogListItem from './BlogListItem';
import { IPredicate } from '../../app/models/category';



const BlogList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {getBlogsByDate,loadBlogs, loadingPosts, setPage, page, totalPages,predicate,removeOnePredicate,clearBlogRegistery
  ,predicateDisplayName,setPredicateDisplayName} = rootStore.blogStore;
  const {getPredicateTexts, predicateTexts} = rootStore.categoryStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadBlogs().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    debugger;
    clearBlogRegistery();
    loadBlogs();
  },[loadBlogs]); //[] provides the same functionality with componentDidMounth..   dependency array

  // useEffect(() => {
  //   debugger;
  //   getPredicateTexts(predicate);
  // },[getPredicateTexts]);

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
       <BlogMainPageItemsPlaceholder count={6} /> :
       <Fragment>
         { 
              <>
              {predicateTexts.map((predi:IPredicate)=>(
                <Button key={predi.key} labelPosition="right" icon='cancel' content={predi.value} style={{backgroundColor:"#335084", color:"#fff", marginBottom:"20px"}}
                onClick={()=>
                  {
                    debugger;
                    removeOnePredicate(predi.predicateName);
                  }
                  
                  }></Button>
                ))}
             { predicate.has('username') && predicate.get('username') !== "" ?
              <>
              <Button key={predicate.get('username')} labelPosition="right" icon='cancel' content={predicateDisplayName} style={{backgroundColor:"#335084", color:"#fff", marginBottom:"20px"}}
                onClick={()=>
                  {
                    debugger;
                    removeOnePredicate("username")
                  }
                  
                  }></Button>
              </>
             :""
       }

              <br/>
              </>
       }
       { predicate.has('username') && predicate.get('username') !== "" ?
              <>
              <h2 style={{color:"#335084"}} key={predicate.get("username")}>"{predicateDisplayName}" kullanıcısının paylaştığı bloglar:</h2>
              <br/>
              </>
             :""
       }
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
          {loadingNext && <BlogMainPageItemsPlaceholder count={3} />}

       </Fragment>
       
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