import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Card, Image, TabProps, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IProfile, IUserActivity } from '../../app/models/profile';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/rootStore';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'


const ProfileMainActivities = () => {
  const rootStore = useStore();
  const {

    userActivities
  } = rootStore.profileStore!;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })



  return (
<>
    <Header className='contentHeader'>Yaklaşan Aktiviteleri &nbsp; ({userActivities.length})
    {/* <Icon name="comment outline"></Icon> */}
</Header>
{/* </Segment> */}
{userActivities.length === 0 && <div className='notFoundText'>Henüz paylaştığı bir blog bulunmamaktadır.</div> }
  <Container>
          <br />
          <Card.Group itemsPerRow={!isTabletOrMobile ? 4 : 2} style={{ maxHeight: "260px"}}>
            {userActivities.map((activity: IUserActivity) => (
              <Card
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
              >
                <Image
                  src={activity.photo}
                  style={{ height: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header className="profile_activity_card_header" textAlign='center'>{activity.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(activity.date), 'dd LLL yyyy',{locale: tr})}</div>
                    <div>{format(new Date(activity.date), 'HH:mm')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
          </Container>
      </>
  );
};

export default observer(ProfileMainActivities);
