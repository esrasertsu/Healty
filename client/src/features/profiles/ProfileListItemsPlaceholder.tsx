import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react'
import _ from "lodash";

const ProfileListItemsPlaceholder = () => {
  return (
   
    <Card.Group doubling itemsPerRow={5} stackable>
    {_.times(5, (i) => (
      <Card key={i}>
          <Placeholder>
            <Placeholder.Image square />
          </Placeholder>
        <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='very short' />
                <Placeholder.Line length='medium' />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
        </Card.Content>
        <Card.Content extra>
        <Placeholder.Line length='short' />
        </Card.Content>
      </Card>
    ))}
  </Card.Group>
  );
};
export default ProfileListItemsPlaceholder;