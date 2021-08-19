import React, {useContext, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import  ActivityDetailedHeader from './ActivityDetailedHeader';
import  ActivityDetailedChat  from './ActivityDetailedChat';
import ActivityDetailedSideBar  from './ActivityDetailedSideBar';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityDetailsMap from './ActivityDetailsMap';
import ActivityDetailPaymentSegment from './ActivityDetailPaymentSegment';

const center = {
    lat: 38.4237,
    lng: 27.1428,
  };
interface DetailParams{
    id:string
}

const ActivtyDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const rootStore = useContext(RootStoreContext);
    const { activity, loadActivity, loadingActivity } = rootStore.activityStore;
    const { user } = rootStore.userStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingActivity) return <LoadingComponent content='Loading activity...'/>  

    if(!activity)
    return <h2>Not Found</h2>

    return (
      <Grid>
          <Grid.Column width={10}>
            <ActivityDetailedHeader activity={activity}/>
            <ActivityDetailedInfo activity={activity} />
{
  user &&
  activity.attendees.filter(x => x.userName === user.userName).length>0 &&
  <ActivityDetailedChat />

}
          </Grid.Column>

          <Grid.Column width={6}>
              <ActivityDetailedSideBar attendees={activity.attendees}/>
              {/* <ActivityDetailsMap centerLocation={center} /> */}
                {
                  !activity.isGoing && !activity.isHost &&
                (activity.attendancyLimit ===null ||activity.attendancyLimit ===0 || (activity.attendancyLimit && (activity.attendancyLimit > activity.attendees.length))) &&
                 <ActivityDetailPaymentSegment activity={activity} />
                 }    
          </Grid.Column>
      </Grid>
    )
}

export default observer(ActivtyDetails)