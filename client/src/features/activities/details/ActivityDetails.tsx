import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import {  RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import  ActivityDetailedHeader from './ActivityDetailedHeader';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedSideBar } from './ActivityDetailedSideBar';
import ActivityDetailedInfo from './ActivityDetailedInfo';


interface DetailParams{
    id:string
}

const ActivtyDetails: React.FC<RouteComponentProps<DetailParams>> = ({match}) => {

    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingInitial || !activity) return <LoadingComponent content='Loading activity...'/>  

    return (
      <Grid>
          <Grid.Column width={10}>
            <ActivityDetailedHeader activity={activity}/>
            <ActivityDetailedInfo activity={activity} />
            <ActivityDetailedChat />
          </Grid.Column>

          <Grid.Column width={6}>
              <ActivityDetailedSideBar />
          </Grid.Column>
      </Grid>
    )
}

export default observer(ActivtyDetails)