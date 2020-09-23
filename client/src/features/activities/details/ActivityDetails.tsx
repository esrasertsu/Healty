import React, {useContext} from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

const ActivtyDetails: React.FC = () => {

    const activityStore = useContext(ActivityStore);
    const { selectedActivity : activity, openEditForm, cancelSelectedActivity } = activityStore;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity!.description}
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
                    <Button basic color='blue' onClick={() => openEditForm(activity!.id)} content='Edit' />
                    <Button basic color='grey' onClick={cancelSelectedActivity} content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivtyDetails)