import React, { useContext, useState } from 'react'
import { Item, Segment, Icon, Label, Card, Popup, Image, Modal, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';
import { StarRating } from '../../../app/common/form/StarRating';
import { borderColors, colors } from '../../../app/models/category';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import tr  from 'date-fns/locale/tr'
import { useHistory } from 'react-router-dom';
import LoginForm from '../../user/LoginForm';
import { observer } from 'mobx-react-lite';
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { BiTimer, BiWifi, BiWifiOff } from "react-icons/bi";

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn,user} = rootStore.userStore;
    const {save,unsave} = rootStore.activityStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 430px)' })

    const history = useHistory();
    const host = activity.attendees.filter(x => x.isHost === true)[0];
    const index = activity.categories && activity.categories.length>0 ? colors.findIndex(x => x.key === activity.categories[0].text): 0;
    const color = colors[index].value;
   const borderColor = borderColors[index].value;
  
   const [durationDay, setDurationDay] = useState(Math.floor(activity.duration / (24*60)))
   const [durationHour, setDurationHour] = useState(Math.floor((activity.duration % (60*24) )/ 60))
   const [durationMin, setDurationMin] = useState(Math.floor((activity.duration % (60*24)) % 60))

    const handleCardClick = (e:any) => {       
            history.push(`/activities/${activity.id}`);
    }

    const handleLoginClick = (e:any,str:string) => {
    
        if(modal.open) closeModal();
    
            openModal("Giriş Yap", <>
            <Image  size={isMobile ? 'big': isTabletOrMobile ? 'medium' :'large'} src='/assets/Login1.jpg'  wrapped />
            <Modal.Description className="loginreg">
            <LoginForm location={str} />
            </Modal.Description>
            </>,true,
            "","blurring",true, "loginModal") 
        }
    
  const handleSave = (e:any,id:string) =>{
    e.stopPropagation();
    if(isLoggedIn)
    {
      save(id).then(() =>{
        activity.isSaved = true;
      })
    }else{
      var str = `/activities/${id}`;
      handleLoginClick(null,str);
    }
  }

  
  const handleUnSave = (e:any,id:string) =>{
    e.stopPropagation();
    if(isLoggedIn)
    {
      unsave(id).then(() =>{
        activity.isSaved = false;
      })
    }else{
        var str = `/activities/${id}`;
        handleLoginClick(null,str);
    }
  }

    return (
       
        <Card className="activityListItem"
         onClick={(e:any) => handleCardClick(e)}
          >
                 
        <Segment.Group>
            {
                activity.categories.length>0 && (
                    <Label
                    style={{ position: 'absolute', zIndex:"1", marginLeft:"13px", marginTop:"10px" , background:color, borderColor:borderColor}}
                    ribbon
                  >
                    {activity.categories[0].text}
                  </Label>
                )
            }
        
            <div>
            
                <Item.Group>
                   
                <Item style={{ zIndex: '1' }} className={isTabletOrMobile? "activityListItem_mobile":""} >
               
                    <div className={isTabletOrMobile? "activityListItemDiv_mobile":"activityListItemDiv"} >
                    {
                        (!activity.isHost) && isTabletOrMobile &&
                        <Popup
                      hoverable
                      position="top center"
                      on={['hover', 'click']}
                      positionFixed
                      content="Kaydet"
                      key={activity.id + Math.random() + "subPopover"}
                      trigger={<BsFillBookmarkStarFill
                        className={activity.isSaved ? 'activity_addToFav_mobile saved' : 'activity_addToFav_mobile'}
                        onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)} />} />
  
                    }  
                        <Item.Image size={!isTabletOrMobile ? "medium":undefined} style={{ display: "block"}} 
                            src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'}
                            className={isTabletOrMobile ? "activityListItem_Image_mobile":""} >
                             
                        </Item.Image>
                       
                       
                    </div>
                  <div className="activityListItem_content_div">

                
                    <Item.Content className={isTabletOrMobile ? "activity_listItem_mobile":"activity_listItem"} >
                        <Item.Header className='activity_listItem_title'>{activity.title}</Item.Header>
                        {(new Date(activity.endDate).getTime() < new Date().getTime()) &&
                        <StarRating rating={activity.star} editing={false} size={'small'} showCount={false}/>}
                        {/* <Item.Description>
                            <div>{activity.description}</div>
                            <div>
                            {activity.city},{activity.venue}
                            </div> 
                        </Item.Description>*/}
                    <Item.Description>
                    {/* <Button
                            as={Link} to={`/activities/${activity.id}`}
                            floated="right"
                            content="İncele"
                            color="blue"
                            /> */}
                              <> 
                              {
                              activity.subCategories.map((sub, index)=>(
                                  index<3 &&
                                    <Label key={sub.value} basic size="small">{sub.text}</Label>
                              )) 
                            }
                            {
                                 activity.subCategories.length>3 &&
                                 <span>+{activity.subCategories.length-3} </span>
                            }
                            </>
                            <div style={{margin:"10px 0 0 0px",width: "max-content", display:"flex", alignItems:"center"}}>
                          <BiTimer style={{fontSize: "21px",marginRight:"8px"}} />
                          <span style={{marginRight:"2px"}}>Süre:</span> 
                          <span style={{marginRight:"2px"}}>{durationDay > 0 && (durationDay + " gün ")}</span>
                          <span style={{marginRight:"2px"}}>{durationHour > 0 && (durationHour +" saat ")}</span>
                          <span>{durationMin >0 && (durationMin + " dakika")}</span>
                         </div> 
                             
                                <Icon style={{color:"#222E50"}} name='heartbeat' /><span> Seviye: </span>
                                {
                                    activity.levels && activity.levels.length> 0 ? 
                                    activity.levels.map<React.ReactNode>(s => <span key={s.value}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                                    : " Bilgi yok"
                                }
                               {activity.online ?  <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}> 
                               <BiWifi style={{fontSize: "20px",marginRight:"8px"}}/><span> Online katılıma açık</span> 
                                </div>: 
                                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                  <BiWifiOff style={{fontSize: "20px",marginRight:"8px"}}/><span> Online katılıma kapalı</span></div>}
                            
                        </Item.Description> 
                        <Item.Description style={{marginTop:"5px"}}>
                            <Item.Image key={host.image} size="mini" style={{width:"25px"}} circular src={host.image || '/assets/user.png'}
                            />
                             &nbsp;<span className="activityHostName">{host.displayName}</span>
                            </Item.Description>
                    </Item.Content>
                    <Item.Content className={isTabletOrMobile ? "activity_listItem_extraContent_mobile":"activity_listItem_extraContent"} >
                   
                    <Item.Description style={{ display: "flex", alignItems: "flex-end", flexDirection:"column", textAlign:"right"}}>
                     {
                       !isTabletOrMobile && (!activity.isHost) && 
                        <Popup
                        hoverable
                        position="top center"
                        on={['hover', 'click']}
                        positionFixed 
                       content="Kaydet"
                       key={activity.id+Math.random()+"subPopover"}
                       trigger={ 
                        <BsFillBookmarkStarFill 
                        className={activity.isSaved?'activity_addToFav saved' :'activity_addToFav' }
                        onClick={(e:any) => activity.isSaved ? handleUnSave(e,activity.id) :handleSave(e,activity.id) } />
                       }
                     />
                      
                        
                    }

                      {activity.isGoing && !activity.isHost &&
                        <span style={{marginTop:"10px"}}>Bu etkinliğe katılıyorsun!</span>
                        }


                         {activity.isHost && 
                            <span>Bu etkinliği sen düzenliyorsun!</span>
                         
                    }
                    </Item.Description>
                    <Item.Description style={{flex:"end"}}>
                        {activity.price === null || activity.price === 0 ? 
                         <div className="baseline-pricing">
                        <div className="baseline-pricing__container">
                        <p className="baseline-pricing__value">
                         Ücretsiz!
                         </p>
                         </div> 
                         </div>
                    
                    : 
                    <div className="baseline-pricing">
                        <p className="baseline-pricing__from">Kişi başı</p> 
                    <div className="baseline-pricing__container">
                    <p className="baseline-pricing__value">
                        {activity.price}&nbsp;TL
                        </p>
                        </div> 
                        <p className="baseline-pricing__category">
                    {/* 'den başlayan fiyatlarla */}
                </p></div>
               }
                    </Item.Description>
                    </Item.Content>
                    </div>
                   
            </Item>
            </Item.Group>
            </div>
            <Segment secondary className="activityListItem_footer">
             <div>
               <div>
               <Icon name='clock' /> Saat: {format(activity.date, 'HH:mm',{locale: tr})}   &nbsp;
               { !activity.online && <>
               <Icon name='marker' /> 
               <span>{activity.venue}, {activity.city && activity.city.text}</span>
               </> 
               }
               </div>
              <div>
              {
                 activity.savedCount > 0 ? 
                        <span><Icon name='bookmark' /> {activity.savedCount} kişi tarafından kaydedildi </span> :
                         <span></span>
              }
              </div>
               
             </div>
                <ActivityListItemAttendees attendees={activity.attendees}/>
            </Segment>
            {/* <Segment secondary>
               <ActivityListItemAttendees attendees={activity.attendees}/>
            </Segment> */}
        </Segment.Group>
        </Card>
    )
}
export default observer(ActivityListItem);
