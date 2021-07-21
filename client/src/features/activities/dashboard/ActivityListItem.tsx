import React, { useContext } from 'react'
import { Item, Segment, Icon, Label, Card, Popup, Image, Modal } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';
import { history } from '../../../index'
import { StarRating } from '../../../app/common/form/StarRating';
import { colors } from '../../../app/models/category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWalking, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { LoginForm } from '../../user/LoginForm';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { RegisterForm } from '../../user/RegisterForm';
import { useMediaQuery } from 'react-responsive'

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn,user} = rootStore.userStore;
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 767px)' })

    const host = activity.attendees.filter(x => x.isHost === true)[0];
    const index = activity.categories && activity.categories.length>0 ? colors.findIndex(x => x.key === activity.categories[0].text): 0;
    const color = colors[index].value;

    const handleLoginClick = (e:any,str:string) => {
        e.stopPropagation();
        if(modal.open) closeModal();

            openModal("Giriş Yap", <>
            <Image size='large' src='/assets/Login1.png' wrapped />
            <Modal.Description>
            <LoginForm location={str} />
            </Modal.Description>
            </>,true,
            <p>Üye olmak için <span className="registerLoginAnchor" onClick={() => openRegisterModal(e,str)}>tıklayınız</span></p>) 
        }
    
        const openRegisterModal = (e:any,str:string) => {
            e.stopPropagation();
            if(modal.open) closeModal();
            openModal("Üye Kaydı", <>
            <Image size='large' src='/assets/Login1.png' wrapped />
            <Modal.Description>
            <RegisterForm location={str} />
            </Modal.Description>
            </>,true,
            <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={() => handleLoginClick(e,str)}>Giriş</span></p>) 
        }

    const handleCardClick = (e:any) => {
        debugger;
        if(!isLoggedIn)
        {    var str = `/activities/${activity.id}`;
            handleLoginClick(e,str); 
        }
        else
        {
            history.push(`/activities/${activity.id}`);
        }
          
    }

    return (
       
        <Card className="activityListItem" onClick={(e:any) => handleCardClick(e)} >
               
        <Segment.Group>
            {
                activity.categories.length>0 && (
                    <Label
                    style={{ position: 'absolute', zIndex:"1", marginLeft:"13px", marginTop:"10px" , background:color}}
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
                        <Item.Image size={!isTabletOrMobile ? "medium":undefined} style={{ display: "block"}} 
                            src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'}
                            className={isTabletOrMobile ? "activityListItem_Image_mobile":""} >
                        </Item.Image>
                        {activity.isGoing && !activity.isHost &&
                         <Popup
                         header={"Bu etkinliğe gidiyorsun"}
                         trigger={
                            <FontAwesomeIcon icon={faWalking} size="2x" style={{position:"absolute", top:10, right:10, color:"#00b5ad"}}/>
                         }
                       />
                        }
                         {activity.isHost && 
                            <Popup
                            header={"Bu etkinliğin düzenleyeni sensin."}
                            trigger={
                                <FontAwesomeIcon icon={faUserEdit} size="2x" style={{position:"absolute", top:10, right:10, color:"#00b5ad"}}/>
                            }
                          />
                    }
                    </div>
                  <div className="activityListItem_content_div">

                
                    <Item.Content className={isTabletOrMobile ? "activity_listItem_mobile":"activity_listItem"} >
                        <Item.Header>{activity.title}</Item.Header>
                        {/* <Item.Description>
                            <div>{activity.description}</div>
                            <div>
                            {activity.city},{activity.venue}
                            </div> 
                        </Item.Description>*/}
                    <Item.Description style={{marginTop: "15px"}}>
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
                              <div style={{marginTop:".6em"}}>
                                <Icon style={{color:"#263a5e"}} name='heartbeat' /><span> Seviye: </span>
                                {
                                    activity.levels && activity.levels.length> 0 ? 
                                    activity.levels.map<React.ReactNode>(s => <span key={s.value}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                                    : " Bilgi yok"
                                }
                               {activity.online ?  <div style={{marginTop:".6em"}}> <Icon name='wifi' color="green" />  Online katılıma açık <Icon name='check' size='small' color='green' /> </div>: <div style={{marginTop:".6em"}}><Icon name='wifi' color="grey"/>Online katılıma kapalı</div>}
                                </div>
                        </Item.Description> 
                        <Item.Description style={{marginTop: "15px"}}>
                            <Item.Image key={host.image} size="mini" circular src={host.image || '/assets/user.png'}
                             style={{}}/>
                             &nbsp;<span className="activityHostName">{"Eğitmen:" +" " +host.displayName}</span>
                            </Item.Description>
                    </Item.Content>
                    <Item.Content className={isTabletOrMobile ? "activity_listItem_extraContent_mobile":"activity_listItem_extraContent"} >
                    <Item.Description style={{textAlign:"right", display: "flex", justifyContent: "flex-end"}}>
                     <StarRating rating={3} editing={false} size={'small'} showCount={false}/>
                    </Item.Description>
                    <Item.Description style={{flex:"end"}}>
                    <div className="baseline-pricing">
                         <p className="baseline-pricing__from">Kişi başı</p> 
                        <div className="baseline-pricing__container">
                        <p className="baseline-pricing__value">
                           {activity.price}&nbsp;₺
                         </p>
                         </div> 
                         <p className="baseline-pricing__category">
                        'den başlayan fiyatlarla
                    </p></div>
                    </Item.Description>
                    </Item.Content>
                    </div>
                   
            </Item>
            </Item.Group>
            </div>
            <Segment clearing secondary className="activityListItem_footer">
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                &nbsp;
                <Icon name='marker' /> {activity.venue}, {activity.city && activity.city.text}
               {
                   isLoggedIn && user &&  <ActivityListItemAttendees attendees={activity.attendees}/>
               }

            </Segment>
           {/*  <Segment secondary>
               <ActivityListItemAttendees attendees={activity.attendees}/>
            </Segment>
            <Segment clearing>
               <span> {activity.description} </span>
              
            </Segment> */}
        </Segment.Group>
        </Card>
    )
}
