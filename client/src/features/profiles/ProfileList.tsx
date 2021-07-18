import React, { Fragment, useContext } from 'react'
import { Card } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ProfileListItem from './ProfileListItem';
import { RootStoreContext } from '../../app/stores/rootStore';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { useMediaQuery } from 'react-responsive'


const fiveItem:SemanticWIDTHS = 5;
const threeItem:SemanticWIDTHS = 3;
const twoItems:SemanticWIDTHS = 2;

const ProfileList: React.FC = () => {

  
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const rootStore = useContext(RootStoreContext);
  const { profileRegistery } = rootStore.profileStore;

  
  return (
    <Fragment>
         <Card.Group itemsPerRow={ isMobile ? twoItems : isTablet ? threeItem: 5} className="allProfileCards">
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
