import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Segment, Icon, Label, Image, Card, Grid, Popup } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';
import { history } from '../../../index'
import { StarRating } from '../../../app/common/form/StarRating';
import { colors } from '../../../app/models/category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWalking, faUserEdit } from '@fortawesome/free-solid-svg-icons'

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const host = activity.attendees.filter(x => x.isHost === true)[0];
    const index = activity.categories && activity.categories.length>0 ? colors.findIndex(x => x.key === activity.categories[0].text): 0;
    const color = colors[index].value;


    useEffect(() => {
        debugger;
       
    }, [activity])
    return (
       
        <Card className="activityListItem" onClick={() => {
            history.push(`/activities/${activity.id}`)
            
            }} >
               
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
                <Item style={{ zIndex: '1' }}>
                    <div style={{height:"100%", width:"30%",position:"relative"}}>
                        <Item.Image size="medium" style={{ display: "block"}} src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} >
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
                    <Item.Content style={{width:"60%", margin:"10px 10px 6px 15px"}}>
                        <Item.Header>{activity.title}</Item.Header>
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
                              {activity.subCategories.map((sub)=>(
                                    <Label key={sub.value} basic size="small">{sub.text}</Label>
                              ))}
                              <div style={{marginTop:".6em"}}>
                                <Icon name='heartbeat' /><span> Seviye: </span>
                                {
                                    activity.levels && activity.levels.length> 0 ? 
                                    activity.levels.map<React.ReactNode>(s => <span key={s.value}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                                    : " Bilgi yok"
                                }
                               {activity.online ?  <div style={{marginTop:".6em"}}> <Icon name='wifi' />  Online katılıma açık <Icon name='check' size='small' color='green' /> </div>: <div style={{marginTop:".6em"}}><Icon name='wifi' />Online katılıma kapalı</div>}
                                </div>
                        </Item.Description> 
                        <Item.Description>
                            <Item.Image key={host.image} size="mini" circular src={host.image || '/assets/user.png'}
                             style={{}}/>
                             &nbsp;<span className="activityHostName">{host.displayName + "  "}</span>
                            </Item.Description>
                    </Item.Content>
                    <Item.Content className="activity_listItem_extraContent">
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
                   
            </Item>
            </Item.Group>
            </div>
            <Segment clearing secondary className="activityListItem_footer">
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                &nbsp;
                <Icon name='marker' /> {activity.venue}, {activity.city && activity.city.text}
                <ActivityListItemAttendees attendees={activity.attendees}/>
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
