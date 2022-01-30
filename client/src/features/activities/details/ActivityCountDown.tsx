import React, { Fragment, useContext } from 'react'
import { Segment, Header, Statistic } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import { IActivity } from '../../../app/models/activity';
import Countdown from 'react-countdown';




const Completionist = () => <span>Aktivite başladı!</span>;


 const ActivityCountDown:React.FC<{activity:IActivity}> = ({activity}) =>  {

    const rootStore = useContext(RootStoreContext);
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
        { (new Date(activity.date).getTime() > new Date().getTime()) ?
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
            :
            <Fragment>
             <Segment
               textAlign='center'
               attached='top'
               inverted
               style={{ border: 'none' }}
               className="segmentHeader"
             >
               <Header>Değerlendirme</Header>
             </Segment>
             <Segment attached>
             <div className="activityDetail_zoom_info">
                Aktivite hakkındaki görüşlerin bizler ve gelecekte katılmak isteyen diğer kullanıcılar için çok değerli. 
            </div>
            </Segment>
            </Fragment>
          
        }
        </>
          
    )
}

export default observer(ActivityCountDown);