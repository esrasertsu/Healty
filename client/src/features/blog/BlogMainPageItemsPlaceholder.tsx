import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react'
import _ from "lodash";

interface IProps {
  count : number;
}
const BlogMainPageItemsPlaceholder:React.FC<IProps> = ({count}) => {
  return (
   
    <Card.Group doubling stackable>
    {_.times(count, (i) => (
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
export default BlogMainPageItemsPlaceholder;