import React, {useContext, useEffect} from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import  ActivityDetailedHeader from './ActivityDetailedHeader';
import  ActivityDetailedChat  from './ActivityDetailedChat';
import ActivityDetailedSideBar  from './ActivityDetailedSideBar';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityDetailPaymentSegment from './ActivityDetailPaymentSegment';
import ActivityCountDown from './ActivityCountDown';
import { useMediaQuery } from 'react-responsive'
import ActivityVideoCall from './ActivityVideoCall';
import ActivityReview from './ActivityReview';

interface DetailParams{
    id:string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const rootStore = useContext(RootStoreContext);
    const { activity, loadActivity, loadingActivity } = rootStore.activityStore;
    const { user,isLoggedIn } = rootStore.userStore;

 const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const scrollToTop = () => {
      document.querySelector('body')!.scrollTo(0,0)
    };

    useEffect(() => {
        loadActivity(match.params.id);
        scrollToTop();

    }, [loadActivity, match.params.id]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingActivity) return <LoadingComponent content='Loading activity...'/>  

    if(!activity)
    return <LoadingComponent content='Loading activity...'/>

    return (
      <Container className="pageContainer">
      
      <Grid  stackable style={{marginBottom:"50px"}}>
      <Grid.Column width={16}>
            <ActivityDetailedHeader activity={activity}/>
          </Grid.Column>
          <Grid.Column width={11}>
            {
                  (activity.isGoing || activity.isHost) && isMobile && 
                  <>
                  <ActivityCountDown activity={activity} /> 
                  {activity.online && <ActivityVideoCall activity={activity} />}
                  </>
                 
                 }   
                 {
                   (new Date(activity.endDate).getTime() < new Date().getTime()) && isMobile && 
                    (!activity.hasCommentByUser && isLoggedIn && activity.isAttendee) && 
                   <ActivityReview activity={activity} />
                 } 
            <ActivityDetailedInfo activity={activity} />
            {
              activity.attendanceCount > 1 &&
              <ActivityDetailedSideBar atCount={activity.attendanceCount} attendees={activity.attendees} date={activity.date}/>

            }

            {
              user && !isMobile &&
              activity.attendees.filter(x => x.userName === user.userName).length>0 &&
              <ActivityDetailedChat />

            }
          </Grid.Column>

          <Grid.Column width={5}>
                 {
                  (activity.isGoing || activity.isHost) && !isMobile && 
                 <ActivityCountDown activity={activity} />
                 }
                 {
                    (new Date(activity.endDate).getTime() < new Date().getTime()) && !isMobile && 
                    (!activity.hasCommentByUser && isLoggedIn && activity.isAttendee) && 
                    <ActivityReview activity={activity} />
                 }   
              {/* <ActivityDetailsMap centerLocation={center} /> */}
                {
                  !activity.isGoing && 
                  !activity.isHost && 
                  (new Date(activity.date).getTime() > new Date().getTime()) &&
                (activity.attendancyLimit ===null ||activity.attendancyLimit ===0 || 
                  (activity.attendancyLimit && (activity.attendancyLimit > activity.attendanceCount))) &&
                 <ActivityDetailPaymentSegment activity={activity} />
                 }  
                   
                  {
                  (activity.isGoing || activity.isHost) && !isMobile && activity.online &&
                 <ActivityVideoCall activity={activity} />
                 }  
                 {
                  user &&  isMobile &&
                  activity.attendees.filter(x => x.userName === user.userName).length>0 &&
                  <ActivityDetailedChat />

                }
                   
          </Grid.Column>
      </Grid>
    
    </Container>
    )
}

export default observer(ActivityDetails)