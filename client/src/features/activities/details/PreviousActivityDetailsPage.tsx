import React, {useContext, useEffect} from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { Link, RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';


interface DetailParams{
    id:string
}

const PreviousActivityDetailsPage: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda

    if(loadingInitial || !activity) return <LoadingComponent content='Loading activity...'/>  

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
                    <Button basic color='blue' as={Link} to={`/manage/${activity.id}`} content='Edit' />
                    <Button basic color='grey' onClick={() => history.push('/activities')} content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(PreviousActivityDetailsPage)