import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/rootStore';
import { FcOvertime,FcClock } from "react-icons/fc";
import { BiWifi, BiWifiOff } from "react-icons/bi";


const ActivityVideoCall:React.FC<{activity:IActivity}> = ({activity}) => {
    const rootStore = useStore();
    const {token} = rootStore.commonStore;
    const {user} = rootStore.userStore;
    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })


    const handleJoinMeeting = () => {

      if(!activity.roomTitle || !activity.hostUrl || !activity.viewUrl)
        {      
            if(activity.isHost)
            {
               // const win = window.open(`http://localhost:9000/create/${activity.id}/${token}/${user!.userName}`, "_blank");
                const win = window.open(`https://meet.afitapp.com/create/${activity.id}/${token}/${user!.userName}`, "_blank");
                    win!.focus()
                
            }else if(activity.isGoing)
            {
                toast.info("Aktivite henüz başlatılmadı!");
            }else{
                toast.info("Bu aktivitenin katılımcısı iseniz lütfen hoca ile ya da admin ile iletişime geçin.");
            }
           
        }
        else if(activity.isHost)
        {
            const win = window.open(`https://meet.afitapp.com${activity.hostUrl}`, "_blank");
         //   const win = window.open(`http://localhost:9000${activity.hostUrl}`, "_blank");
            win!.focus()
        }
        else if(activity.isGoing){
            const win = window.open(`https://meet.afitapp.com${activity.viewUrl}`, "_blank");
            win!.focus()
        }else{
            toast.info("Bu aktivitenin katılımcısı iseniz lütfen hoca ile ya da admin ile iletişime geçin.");
        }
      }


      //öğrenciler burada yakalansın
    return (<>
        {
           <div className='activityDetails_videoCall-segment'>
            <Segment attached>
            <Header>Online Aktivite  </Header>
                <div style={{marginBottom:"10px",display:"flex", alignItems:"center"}}>
                <FcOvertime size="25" />
            <span style={{fontSize:"15px"}}>Tarih: {format(new Date(new Date(activity.date).valueOf() - 86400000),'dd MMMM yyyy, eeee',{locale: tr})} </span>
                </div>
                <div style={{display:"flex", alignItems:"center"}}>
                <FcClock size="25" />
            <span style={{fontSize:"15px"}}>Saat: { activity.date && format(activity.date, 'H:mm',{locale: tr})} </span>

                </div>
            </Segment>
            <Segment clearing attached='bottom' style={{backgroundColor:"#e8e8e8d1", display:"flex", justifyContent:"flex-end"}}>
            {
               <Button circular  className='orangeBtn' onClick={handleJoinMeeting} content={"Katıl"} icon="video" labelPosition="right"></Button>
            }
               </Segment>
            </div>
          
        }
        </>
          
    )
}


export default observer(ActivityVideoCall);