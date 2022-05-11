import React, { Fragment } from 'react';
import { Segment, Placeholder } from 'semantic-ui-react';
const ActivityListItemPlaceholder = () => {
  return (
    <Fragment>
      <Placeholder fluid style={{ marginTop: 50 }}>
        <Segment.Group>
          <Segment key="1" style={{ minHeight: 110 }}>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
          <Segment key="2">
            <Placeholder>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder>
          </Segment>
        </Segment.Group>
      </Placeholder>
    </Fragment>
  );
};
export default ActivityListItemPlaceholder;