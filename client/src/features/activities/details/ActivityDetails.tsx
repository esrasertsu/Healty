import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activity: IActivity;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (selectedActivity: IActivity | null) => void;
}

const ActivtyDetails: React.FC<IProps> = ({ activity, setEditMode, setSelectedActivity}) => {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                 </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <a>
                    <Icon name='user' />
                    22 Friends
               </a>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' onClick={() => setEditMode(true)} content='Edit' />
                    <Button basic color='grey' onClick={() => { setSelectedActivity(null); setEditMode(false) }} content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default ActivtyDetails