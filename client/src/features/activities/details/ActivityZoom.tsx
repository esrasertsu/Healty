import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Button, Icon, Statistic, StatisticGroup } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import { IActivity } from '../../../app/models/activity';
import tr  from 'date-fns/locale/tr'
import { format } from 'date-fns';
import Countdown from 'react-countdown';
import { action } from 'mobx';
import ActivityJoinInfoForm from './ActivityJoinInfoForm';
import { useMediaQuery } from 'react-responsive'


const meetConfig = {
	meetingNumber: '78555278263',
	leaveUrl: 'http://localhost:3000',
	userName: 'Firstname Lastname',
	userEmail: 'firstname.lastname@yoursite.com',
	passWord: 'password', // if required
	role: 0 // 1 for host; 0 for attendee
};

const Completionist = () => <span>You are good to go!</span>;


 const ActivityZoom:React.FC<{activity:IActivity}> = ({activity}) =>  {

    const rootStore = useContext(RootStoreContext);
    const { generateZoomToken } = rootStore.activityStore;
    const { user } = rootStore.userStore;
    const {openModal, closeModal} = rootStore.modalStore;
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })

  //const initiateMeeting = (ZoomMtg: any,signature:string) => {

    // ZoomMtg.init({
    //     leaveUrl: window.location.href,
    //     isSupportAV: true,
    //     success: (success :any) => {
    //       console.log(success)
      
    //       ZoomMtg.join({
    //         signature: signature,
    //         meetingNumber: '78555278263',
    //         userName: user!.userName,
    //         apiKey: process.env.REACT_APP_ZOOM_API_KEY as string,
    //         userEmail: "esraaa_sertsu@hotmail.com",
    //         passWord: "BMK8xz",
    //         success: (success:any) => {
    //           console.log(success)
    //         },
    //         error: (error:any) => {
    //           console.log(error)
    //         }
    //       })
      
    //     },
    //     error: (error:any) => {
    //       console.log(error)
    //     }
    //   })
 // }
 function generateUrl(url:string, params:any) {
    var i = 0, key;
    for (key in params) {
        if (i === 0) {
            url += "?";
        } else {
            url += "&";
        }
        url += key;
        url += '=';
        url += params[key];
        i++;
    }
    return url;
}

  const handleJoinMeeting = () => {
    //setJoinMeeting(true);
    // import("@zoomus/websdk").then((a)=> //importu yukarı çeke
    // {
      //  showZoomDiv();
        // a.ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.5/lib', '/av'); 
        // a.ZoomMtg.preLoadWasm();
        // a.ZoomMtg.prepareWebSDK();
        var url = generateUrl("http://localhost:9999",{ 
            mid: meetConfig.meetingNumber,
            pwd: meetConfig.passWord,
            role: meetConfig.role,
            name: meetConfig.userName,
            activityid:activity.id,
            token: user!.token
        });
        window.open(url, "_blank");        

        generateZoomToken(meetConfig.meetingNumber,"0")
        .then(action((response) => {
           // response !="" && 9999 a gönder
           // initiateMeeting(ZoomMtg,response);
        }))
        
    // });

  }


  const handleEditJoinInfo = () => {
    openModal("Video Yükleme",<ActivityJoinInfoForm closeModal={closeModal} />,false,null)

  }

    return (<>
        {
           <>
            <Segment
              textAlign='center'
              attached='top'
              inverted
              style={{ border: 'none' }}
              className="segmentHeader"
            >
              <Header>Online Aktivite  </Header>
            </Segment>
            <Segment attached>
                
                
            <div className="activityDetail_zoom_title">
                 <h4 className="activityDetail_title">{activity.title}</h4>
                 </div>
            <div className="activityDetail_payment_calender" style={{marginBottom:"25px"}}>
                <div>
                <Icon size="big" name="calendar alternate" className="activityDetail_payment_calenderIcon" />
            <span style={{fontSize:"15px"}}>Tarih: {format(new Date(new Date(activity.date).valueOf() - 86400000),'dd MMMM yyyy, eeee',{locale: tr})} </span>
                </div>
                <div>
                <Icon size="big" name="clock outline" className="activityDetail_payment_calenderIcon" />
            <span style={{fontSize:"15px"}}>Saat: { activity.date && format(activity.date, 'H:mm',{locale: tr})} </span>

                </div>
           
              </div>   
                <div className="activityDetail_zoom_info">
                {activity.activityJoinDetails && activity.activityJoinDetails.zoom &&
                    <div className="activityDetail_zoom_info_warning">*Aşağıdaki "Katıl" butonu ile aktiviteye direk katılamıyorsan aktivite katılım detayları:</div>
                 }
                  <div><b>Platform</b>:{activity.activityJoinDetails && activity.activityJoinDetails.zoom && "Zoom"}</div>
                    <div>Meeting Id: {activity.activityJoinDetails ? activity.activityJoinDetails.meetingId : "Belirtilmemiş"}</div>
                    <div>Password: {activity.activityJoinDetails ? activity.activityJoinDetails.meetingPsw: "Belirtilmemiş"}</div>
                    <div>Url: <a href={activity.activityJoinDetails && activity.activityJoinDetails.activityUrl} target="_blank" style={{textDecoration:"underline",color: "#263a5e"}}>{activity.activityJoinDetails ? activity.activityJoinDetails.activityUrl: "Belirtilmemiş"}</a></div>

                </div>
               {activity.isHost &&   <Button className="editJoinInfoBtn" content="Katılım Detaylarını Düzenle" onClick={handleEditJoinInfo} />} 

            </Segment>
            <Segment clearing attached='bottom' style={{backgroundColor:"#e8e8e8d1", display:"flex", justifyContent:"flex-end"}}>
            {activity.activityJoinDetails && activity.activityJoinDetails.zoom && !isTablet &&
               <Button color="green" onClick={handleJoinMeeting} content={"Katıl"} icon="video" labelPosition="right"></Button>
            }
               </Segment>
            </>
          
        }
        </>
          
    )
}

export default observer(ActivityZoom);