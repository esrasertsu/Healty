import React, { Fragment, useContext } from 'react'
import { Card, Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ProfileListItem from './ProfileListItem';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';

const ProfileList: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { profileRegistery } = rootStore.profileStore;

  return (
    <Fragment>
    
         
         <Card.Group itemsPerRow={6} stackable className="allProfileCards">
        {
        Array.from(profileRegistery.values()).map((pro2) => (
            <ProfileListItem key={pro2!.userName+Math.random()} profile={pro2} />
            ))
        }
        </Card.Group>
     
    </Fragment>
    
  );
};

export default observer(ProfileList)
