import React, { Fragment, useContext } from 'react'
import { Segment, Header, Statistic } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import { IActivity } from '../../../app/models/activity';
import Countdown from 'react-countdown';
import ActivityReview from './ActivityReview';




const Completionist = () => <div style={{textAlign:"center", marginTop:"20px"}}>Aktivite başladı!</div>;


 const ActivityCountDown:React.FC<{activity:IActivity}> = ({activity}) =>  {

    const rootStore = useStore();
    const { user } = rootStore.userStore;


  const renderer = ({ days,hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <Statistic.Group className="activityDetail_Countdown_StatisticsGroup">
        <Statistic className="activityDetail_Countdown_Statistic day">
          <Statistic.Value>{days}</Statistic.Value>
          <Statistic.Label>Gün</Statistic.Label>
        </Statistic>
        <Statistic className="activityDetail_Countdown_Statistic">
          <Statistic.Value>{hours}</Statistic.Value>
          <Statistic.Label>Saat</Statistic.Label>
        </Statistic>
        <div style={{margin: "2.5em 0px"}}>:</div>

        <Statistic className="activityDetail_Countdown_Statistic">
          <Statistic.Value>{minutes}</Statistic.Value>
          <Statistic.Label>Dakika</Statistic.Label>
        </Statistic>
        <div style={{margin: "2.5em 0px"}}>:</div>

        <Statistic className="activityDetail_Countdown_Statistic">
          <Statistic.Value>{seconds}</Statistic.Value>
          <Statistic.Label>Saniye</Statistic.Label>
        </Statistic>
      </Statistic.Group>
        
      );
    }
  };

    return (<>
        {
           <>
            <Segment className="activityDetails_Countdown_Segment">
                <div className="activityDetail_Countdown_Header">
                    <span>Aktivitenin başlamasına kalan süre</span>
                    {/* <Icon loading name='hourglass half' />    */}
                </div>
                <div className="activityDetail_Countdown">
                   <Countdown date={new Date(activity.date)} renderer={renderer}  />
                </div>
            </Segment>
            </>

        }
        </>
          
    )
}

export default observer(ActivityCountDown);