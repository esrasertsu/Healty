import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Item, Header, Button, Image, Modal, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import tr  from 'date-fns/locale/tr'

const activityImageStyle = {
  filter: 'brightness(50%)',
  height:'350px',
  objectFit: 'cover'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  paddingLeft: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
  paddingRight: '5%',
};
const ActivityDetailedHeader:React.FC<{activity:IActivity}> = ({activity}) => {
  const host = activity.attendees && activity.attendees.filter(x => x.isHost === true)[0];

  const rootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance, loading, deleteActivity} = rootStore.activityStore;
  const [open, setOpen] = React.useState(false);

  const handleDeleteActivity = (e:any) => {
    debugger;
    deleteActivity(e,activity.id);
  }

    return (
      <>
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
                            <p>{activity.date && format(activity.date,'dd MMMM, eeee',{locale: tr})}</p>
                            <p>
                              Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Segment>
                  </Segment>
                <Segment clearing attached='bottom'>
                    {activity.isHost && host && host.userRole!=="User" ? (
                      <>
                      <Button as={Link} to={`/manage/${activity.id}`} color='orange' floated='right'
                      content='Düzenle'
                      labelPosition='right'
                      icon='edit'>
                      </Button>
                      <Modal
                        basic
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size='small'
                        trigger={<Button color='red' floated='right' content='Sil'
                        labelPosition='right'
                        icon='trash'></Button>}
                      >
                        <Header icon>
                          <Icon name='archive' />
                          Aktivite Silme Onayı
                        </Header>
                        <Modal.Content>
                          <p>
                            Oluşturmuş olduğun bu aktiviteyi silmek istediğine emin misin?
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button basic color='grey' onClick={() => setOpen(false)}>
                            <Icon name='backward' /> İptal
                          </Button>
                          <Button basic color='red' onClick={(e:any) => {handleDeleteActivity(e);setOpen(false)}}>
                            <Icon name='trash' /> Sil
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    </>                   
                    ): activity.isGoing ? (
                      <Button loading={loading} onClick={cancelAttendance}>Katılımı iptal et</Button>
                    ): (
                      <>
                      { 
                      activity.attendancyLimit && (activity.attendancyLimit !==0 && (activity.attendancyLimit>0) && (activity.attendancyLimit - activity.attendees.length) <4) ?
                      <span style={{color:"red"}}>Son {activity.attendancyLimit - activity.attendees.length} katılımcı!</span> : ""
                      }{
                      (activity.attendancyLimit ===null ||activity.attendancyLimit ===0 || (activity.attendancyLimit && (activity.attendancyLimit > activity.attendees.length))) &&
                      <Button  floated='right' loading={loading} onClick={attendActivity} color='teal'>Aktiviteye Katıl</Button>
                      }   
                      
                      </>
                    )}
                  </Segment>
                </Segment.Group>
        </div>
    </>
    )
}

export default observer(ActivityDetailedHeader)