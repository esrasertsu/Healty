import React from 'react'
import { Image, List, Popup } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'

interface IProps{
    attendees: IAttendee[]
}

const styles = {
  borderColor: 'orange',
  borderWidth: 2
}
export const ActivityListItemAttendees: React.FC<IProps> = ({attendees}) => {
    return (
      <List horizontal style={{float:'right'}}>
        {
        attendees.map((attendee,index) => (
         index<4 &&
          <List.Item key={attendee.userName}>
            <Popup
              header={attendee.displayName}
              trigger={
                <Image
                  size="mini"
                  circular
                  src={attendee.image || "/assets/user.png"}
                  bordered
                  style ={attendee.isFollowing ? styles : null}
                  onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}
                />
              }
            />
          </List.Item>
        ))
      }
      </List>
    );
};

