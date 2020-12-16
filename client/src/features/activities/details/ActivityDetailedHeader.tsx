import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};
const ActivityDetailedHeader:React.FC<{activity:IActivity}> = ({activity}) => {
  const host = activity.attendees.filter(x => x.isHost === true)[0];

  const rootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance, loading} = rootStore.activityStore;

    return (
        <div>
                <Segment.Group>
                  <Segment basic attached='top' style={{ padding: '0' }}>
                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                    <Segment basic style={activityImageTextStyle}>
                      <Item.Group>
                        <Item>
                          <Item.Content>
                            <Header
                              size='huge'
                              content={activity.title}
                              style={{ color: 'white' }}
                            />
                            <p>{format(activity.date,'eeee do MMMM')}</p>
                            <p>
                              Hosted by <strong>{host.userName}</strong>
                            </p>
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Segment>
                  </Segment>
                  <Segment clearing attached='bottom'>
                    {activity.isHost ? (
                      <Button as={Link} to={`/manage/${activity.id}`} color='orange' floated='right'>
                         Manage Event
                      </Button>
                    ): activity.isGoing ? (
                      <Button loading={loading} onClick={cancelAttendance}>Cancel attendance</Button>
                    ): (
                      <Button loading={loading} onClick={attendActivity} color='teal'>Join Activity</Button>
                    )}
                    
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default observer(ActivityDetailedHeader)