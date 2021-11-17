import React, {useContext, useEffect, useState} from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { toast } from 'react-toastify';
import { BlogUpdateFormValues } from '../../app/models/blog';



const Admin: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const { post, loadBlog, loadingPost ,setUpdatedBlog, updatedBlog, setBlogForm} = rootStore.blogStore;
    const [editMode, setEditMode] = useState(false);

    return (
        <Container className="pageContainer">
 
      <Grid>
          <Grid.Column>
            
          </Grid.Column>
      </Grid>
     </Container>
    )
}

export default observer(Admin)