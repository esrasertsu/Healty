import { observer } from 'mobx-react-lite';
import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import SavedActivities from './SavedActivities';
import SavedProfiles from './SavedProfiles';

const SavedPage = () => {

    const panes = [
       
        { menuItem: 'Kaydedilen Aktiviteler', render: () => <SavedActivities />
        },
         {
            menuItem: 'Favori Eğitmenler',
            render: () => <SavedProfiles />
            ,
          }
      ]

  return (
    <Container className="pageContainer">
        <Tab className="savedPage_tab" style={{margin:"30px 0"}} panes={panes} menu={{ secondary: true, pointing: true }} />
    </Container>
  );
};


export default observer(SavedPage)