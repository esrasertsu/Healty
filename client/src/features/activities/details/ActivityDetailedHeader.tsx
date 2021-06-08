import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';

const activityImageStyle = {
  filter: 'brightness(50%)'
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
  const host = activity.attendees && activity.attendees.filter(x => x.isHost === true)[0];

  const rootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance, loading} = rootStore.activityStore;

    return (
        <div>
                <Segment.Group>
                  <Segment basic attached='top' style={{ padding: '0' }}>
                    <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} fluid style={activityImageStyle}/>
                    <Segment basic style={activityImageTextStyle}>
                      <Item.Group>
                        <Item>
                          <Item.Content>
                            <Header
                              size='huge'
                              content={activity.title}
                              style={{ color: 'white' }}
                            />
                            <p>{activity.date && format(activity.date,'eeee do MMMM')}</p>
                            <p>
                              Hosted by <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Segment>
                  </Segment>
                <Segment clearing attached='bottom'>
                    {activity.isHost && host && host.userRole!=="User" ? (
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