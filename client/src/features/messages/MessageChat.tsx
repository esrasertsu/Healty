import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoadingComponent } from '../../app/layout/LoadingComponent';


const MessageChat: React.FC = () => {
debugger;
    const rootStore = useContext(RootStoreContext);
    const { post, loadBlog, loadingPost } = rootStore.blogStore;


   // if(loadingPost) return <LoadingComponent content='Loading messages...'/>  

    return (
      <Grid>
        
      </Grid>
    )
}

export default observer(MessageChat)