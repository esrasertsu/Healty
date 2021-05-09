import React, { Fragment } from 'react';
import { Placeholder, Segment } from 'semantic-ui-react'

const ProfileCommentPlaceHolder = () => {
  return (
    <Fragment>
    <Segment
      textAlign='left'
      attached='top'
      className="profile_segmentHeaders"
    >
    <Placeholder>
    <Placeholder.Header image>
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Header>
  </Placeholder>
  </Segment>
  </Fragment>
  );
};
export default ProfileCommentPlaceHolder;