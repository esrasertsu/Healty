import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import {ActivityListItemAttendees } from './ActivityListItemAttendees';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  
    const host = activity.attendees.filter(x => x.isHost === true)[0];
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                <Item>
                    <Item.Image size="tiny" circular src={host.image || '/assets/user.png'}
                    style={{marginBottom:50}}/>
                    <Item.Content>
                    <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                    <Item.Description>
                        <div>{activity.description}</div>
                        <div>
                        {activity.city},{activity.venue}
                        </div>
                    </Item.Description>
                    <Item.Description>Hosted by <Link to={`/profile/${host.userName}`} >{host.displayName}</Link></Item.Description>
                    {activity.isHost && 
                    <Item.Description><Label basic color="orange" content="You're hosting this activity"></Label></Item.Description>
                    }
                 {activity.isGoing && !activity.isHost &&
                    <Item.Description><Label basic color="green" content="You're going to this activity"></Label></Item.Description>
                }
                {/* <Item.Extra>
                        <Button
                        name={activity.id}
                        loading={target === activity.id && submitting}
                        onClick={(e) => deleteActivity(e, activity.id)}
                        floated="right"
                        content="Delete"
                        color="red"
                        />
                        <Label basic>{activity.category}</Label>
                    </Item.Extra> */}
                    </Item.Content>
            </Item>
            </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                &nbsp;
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
               <ActivityListItemAttendees attendees={activity.attendees}/>
            </Segment>
            <Segment clearing>
               <span> {activity.description} </span>
               <Button
                        as={Link} to={`/activities/${activity.id}`}
                        floated="right"
                        content="View"
                        color="blue"
                        />
            </Segment>
        </Segment.Group>
     
    )
}
