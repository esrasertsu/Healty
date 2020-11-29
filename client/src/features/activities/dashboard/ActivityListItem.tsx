import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Segment, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {  

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                <Item>
                    <Item.Image size="tiny" circular src='/assets/user.png' />
                    <Item.Content>
                    <Item.Header as="a">{activity.title}</Item.Header>
                    <Item.Description>
                        <div>{activity.description}</div>
                        <div>
                        {activity.city},{activity.venue}
                        </div>
                    </Item.Description>
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
                Attendees will go here
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
