import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Segment, Icon, Label, Image, Card, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';
import { history } from '../../../index'
import { StarRating } from '../../../app/common/form/StarRating';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const host = activity.attendees.filter(x => x.isHost === true)[0];
    return (
       
        <Card className="activityListItem" onClick={() => {
            history.push(`/activities/${activity.id}`)
            
            }} >
               
        <Segment.Group>
        <Label
                    style={{ position: 'absolute', zIndex:"1", marginLeft:"13px", marginTop:"10px" }}
                    color='orange'
                    ribbon
                  >
                    {activity.category}
                  </Label>
            <Segment>
            
                <Item.Group>
                <Item style={{ zIndex: '1' }}>
                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} 
                    style={{height:"100% important!", width:"20%"}}/>
                    <Item.Content style={{width:"60%"}}>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                        {/* <Item.Description>
                            <div>{activity.description}</div>
                            <div>
                            {activity.city},{activity.venue}
                            </div> 
                        </Item.Description>*/}
                        <Item.Description>
                            <Item.Image size="mini" circular src={host.image || '/assets/user.png'}
                             style={{}}/>
                             &nbsp; Hosted by <Link to={`/profile/${host.userName}`} >{host.displayName}</Link>
                            </Item.Description>
                        <Item.Meta></Item.Meta>
                        {activity.isHost && 
                        <Item.Description><Label size="small" basic color="orange" content="You're hosting this activity"></Label></Item.Description>
                        }
                    {activity.isGoing && !activity.isHost &&
                        <Item.Description><Label size="small" basic color="green" content="You're going to this activity"></Label></Item.Description>
                    }
                    
                    <Item.Description>
                    {/* <Button
                            as={Link} to={`/activities/${activity.id}`}
                            floated="right"
                            content="İncele"
                            color="blue"
                            /> */}
                            <Label basic size="small">{activity.category}</Label>
                        </Item.Description> 
                    </Item.Content>
                    <Item.Content className="activity_listItem_extraContent">
                    <Item.Description style={{textAlign:"right", display: "flex", justifyContent: "flex-end"}}>
                     <StarRating rating={3} editing={false} size={'small'} showCount/>
                    </Item.Description>
                    <Item.Description style={{flex:"end"}}>
                    <div className="baseline-pricing">
                        {/* <p className="baseline-pricing__from">Kişi başı</p> */}
                        <div className="baseline-pricing__container">
                        <p className="baseline-pricing__value">
                            849.21&nbsp;₺
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
