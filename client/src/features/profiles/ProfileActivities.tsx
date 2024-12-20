import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Card, Image, TabProps, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IProfile, IUserActivity } from '../../app/models/profile';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/rootStore';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'

const getPanes = (profile:IProfile) => {

  let panes = [];

  return panes = [
    { menuItem: 'Gelecek', pane: { key: 'futureEvents' } },
    { menuItem: 'Geçmiş', pane: { key: 'pastEvents' } }
  ];
  
  // if(profile.role === "Trainer")
  // {
  //   return panes = [
  //     { menuItem: 'Gelecek', pane: { key: 'futureEvents' } },
  //     { menuItem: 'Geçmiş', pane: { key: 'pastEvents' } },
  //     { menuItem: 'Düzenledikleri', pane: { key: 'hosted' } }
  //   ];
  // }else 
  //     return panes = [
  //       { menuItem: 'Gelecek', pane: { key: 'futureEvents' } },
  //       { menuItem: 'Geçmiş', pane: { key: 'pastEvents' } }
  //     ];

}

const ProfileEvents = () => {
  const rootStore = useStore();
  const {
    loadUserActivities,
    profile,
    loadingActivities,
    userActivities
  } = rootStore.profileStore!;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })

  useEffect(() => {
    loadUserActivities(profile!.userName);
  }, [loadUserActivities, profile]);

  const handleTabChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: TabProps
  ) => {
    let predicate;
    switch (data.activeIndex) {
      case 1:
        predicate = 'past';
        break;
      case 2:
        predicate = 'hosting';
        break;
      default:
        predicate = 'future';
        break;
    }
    loadUserActivities(profile!.userName, predicate);
  };

  return (
    <Tab.Pane style={{ borderRadius: "12px"}} loading={loadingActivities}>
      <Grid>
        {
          isTabletOrMobile && 
          <Grid.Column width={16}>
          <Header floated='left' icon='calendar check outline' style={{fontSize:"16px"}} content={'Activities'} />
        </Grid.Column>
        }
          
        <Grid.Column width={16}>
          <Tab
            panes={getPanes(profile!)}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={!isTabletOrMobile ? 4 : 2} style={{ maxHeight: "260px", overflow: "hidden",overflowY: "scroll"}}>
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
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileEvents);
