import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import BlogPageHeader from './BlogPageHeader';
import BlogPageDesc from './BlogPageDesc';
import BlogMoreFromUser from './BlogMoreFromUser';
import BlogMoreFromThisCategory from './BlogMoreFromThisCategory';


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
        debugger;
    }, [loadBlog, match.params.id, history]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingPost) return <LoadingComponent content='Loading blog...'/>  

    return (
      <Grid>
          <Grid.Column>
            <BlogPageHeader blog={post!} />
            <BlogPageDesc blog={post!} />
            <BlogMoreFromUser blog={post!} />
            <BlogMoreFromThisCategory blog={post!} />
          </Grid.Column>
      </Grid>
    )
}

export default observer(BlogPage)