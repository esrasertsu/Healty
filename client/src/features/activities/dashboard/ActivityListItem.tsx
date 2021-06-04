import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Segment, Icon, Label, Image, Card, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';
import { history } from '../../../index'
import { StarRating } from '../../../app/common/form/StarRating';
import { colors } from '../../../app/models/category';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const host = activity.attendees.filter(x => x.isHost === true)[0];
    const index = activity.categories && activity.categories.length>0 ? colors.findIndex(x => x.key === activity.categories[0].text): 0;
    const color = colors[index].value;
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
       
            <Segment>
            
                <Item.Group>
                <Item style={{ zIndex: '1' }}>
                    <Item.Image size='big' style={{height:"100%", width:"25%"}} src={activity.image || '/assets/placeholder.png'} ></Item.Image>
                    <Item.Content style={{width:"60%"}}>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                        {activity.isGoing && !activity.isHost &&
                        <Label size="small" basic color="green" content="Bu aktiviteye gidiyorsun!"></Label>
                    }
                        {/* <Item.Description>
                            <div>{activity.description}</div>
                            <div>
                            {activity.city},{activity.venue}
                            </div> 
                        </Item.Description>*/}
                        <Item.Description>
                            <Item.Image size="mini" circular src={host.image || '/assets/user.png'}
                             style={{}}/>
                             &nbsp; Hosted by <Link to={`/profile/${host.userName}`} >{host.displayName + "  "}</Link>
                             {activity.isHost && 
                       <Label size="small" basic color="orange" content="Bu aktivitenin düzenleyeni sensin!"></Label>
                        }
                            </Item.Description>
                        <Item.Meta></Item.Meta>
                    <Item.Description>
                    {/* <Button
                            as={Link} to={`/activities/${activity.id}`}
                            floated="right"
                            content="İncele"
                            color="blue"
                            /> */}
                              {activity.subCategories.map((sub)=>(
                                    <Label basic size="small">{sub.text}</Label>
                              ))}
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
            </Segment>
            <Segment clearing secondary>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                &nbsp;
                <Icon name='marker' /> {activity.venue}, {activity.city}
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
