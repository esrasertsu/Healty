import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import BlogPageHeader from './BlogPageHeader';
import BlogPageDesc from './BlogPageDesc';


const center = {
    lat: 38.4237,
    lng: 27.1428,
  };
interface DetailParams{
    id:string
}

const BlogPage: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
debugger;
    const rootStore = useContext(RootStoreContext);
    const { post, loadBlog, loadingPost } = rootStore.blogStore;

    useEffect(() => {
        loadBlog(match.params.id);
    }, [loadBlog, match.params.id, history]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingPost) return <LoadingComponent content='Loading blog...'/>  

    if(!post)
       history.push('/notFound');

    return (
      <Grid>
          <Grid.Column>
            <BlogPageHeader blog={post!} />
            <BlogPageDesc blog={post!} />
          </Grid.Column>
      </Grid>
    )
}

export default observer(BlogPage)