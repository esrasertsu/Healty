import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { useMediaQuery } from 'react-responsive';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ActivityVideoCall:React.FC<{activity:IActivity}> = ({activity}) => {
    const rootStore = useContext(RootStoreContext);
    const {token} = rootStore.commonStore;
    const {user} = rootStore.userStore;
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })


    const handleJoinMeeting = () => {
      //  const win = window.open(`/videoMeeting/${activity.id}`, "_blank");
      const win = window.open(`https://meet.afitapp.com/create/${activity.id}/${token}/${user!.userName}`, "_blank");
        win!.focus()
      }

    return (<>
        {
           <>
            <Segment attached>
            <Header>Online Aktivite  </Header>
                <div style={{marginBottom:"10px"}}>
                <Icon size="big" name="calendar alternate" className="activityDetail_payment_calenderIcon" />
            <span style={{fontSize:"15px"}}>Tarih: {format(new Date(new Date(activity.date).valueOf() - 86400000),'dd MMMM yyyy, eeee',{locale: tr})} </span>
                </div>
                <div>
                <Icon size="big" name="clock outline" className="activityDetail_payment_calenderIcon" />
            <span style={{fontSize:"15px"}}>Saat: { activity.date && format(activity.date, 'H:mm',{locale: tr})} </span>

                </div>
            </Segment>
            <Segment clearing attached='bottom' style={{backgroundColor:"#e8e8e8d1", display:"flex", justifyContent:"flex-end"}}>
            {
               <Button circular  className='orangeBtn' onClick={handleJoinMeeting} content={"Katıl"} icon="video" labelPosition="right"></Button>
            }
               </Segment>
            </>
          
        }
        </>
          
    )
}


export default observer(ActivityVideoCall);