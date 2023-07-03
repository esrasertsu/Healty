import React, {useContext, useEffect, useState} from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { useStore } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import BlogPageHeader from './BlogPageHeader';
import BlogPageDesc from './BlogPageDesc';
import BlogMoreFromUser from './BlogMoreFromUser';
import BlogMoreFromThisCategory from './BlogMoreFromThisCategory';
import { toast } from 'react-toastify';
import { BlogUpdateFormValues } from '../../app/models/blog';
import { Helmet } from 'react-helmet-async';


interface DetailParams{
    id:string
}

const BlogPage: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const rootStore = useStore();
    const { post, loadBlog, loadingPost ,setUpdatedBlog, updatedBlog, setBlogForm} = rootStore.blogStore;
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        loadBlog(match.params.id)
        .then((blog) => 
        {
            setBlogForm(new BlogUpdateFormValues(blog!))}
        )
    }, [loadBlog, match.params.id, history,setBlogForm]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    useEffect(() => {
        if(updatedBlog)
         {
           setEditMode(false);
           toast.success("Blog güncellendi!")
         }
       
      }, [updatedBlog])

    if(loadingPost) return <LoadingComponent content='Loading blog...'/>  

    return (
      <>
       <Helmet>
        <title>Afitapp - {post!.title}</title>
      </Helmet>
      <Container className="pageContainer">
 
 <Grid>
     <Grid.Column>
       <BlogPageHeader blog={post!} />
       <BlogPageDesc editMode={editMode} setEditMode={setEditMode} setUpdatedBlog={setUpdatedBlog} updatedBlog={updatedBlog}  blog={post!} />
       <BlogMoreFromUser blog={post!} />
       <BlogMoreFromThisCategory blog={post!} />
     </Grid.Column>
 </Grid>
</Container>
      </>
      
    )
}

export default observer(BlogPage)