import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Segment, List, Item, Label,Image } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'
import { Scrollbars } from 'react-custom-scrollbars';

interface IProps{
  attendees: IAttendee[];
}
 const ActivityDetailedSideBar: React.FC<IProps> = ({attendees}) => {
    return (
          <Fragment>
            <Segment
              textAlign='center'
              style={{ border: 'none' }}
              attached='top'
              secondary
              inverted
              color='teal'
            >
              {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going
            </Segment>
            <Segment secondary attached style={{ border: 'none'}}>
            <Scrollbars
             frameBorder="2px" 
             style={{ 
               backgroundColor:"white", 
               height: "340px", 
             //  width: "calc(100% - (-1px * 2))", 
              // maxWidth: "calc(100% - (-1px * 2))",
               }}
             autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
             >
            <List relaxed divided style={{margin: "14px 29px 14px 14px"}}>
                {attendees.map((attendee) => (
                  <Item key={attendee.userName} style={{ position: 'relative' }}>
                 {attendee.isHost &&
                  <Label
                    style={{ position: 'absolute' }}
                    color='orange'
                    ribbon='right'
                  >
                    Host
                  </Label> 
                  }
                  <Image size='tiny' src={attendee.image  || '/assets/user.png'} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`/profile/${attendee.userName}`}>{attendee.displayName}</Link>
                    </Item.Header>
                    {attendee.isFollowing &&
                     <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                    }
                  </Item.Content>
                </Item>
                ))}
              </List>
            </Scrollbars> 
            </Segment>
            {/* <Segment attached style={{height:"340px", overflowY:"scroll", overflowX:"hidden", marginRight: "-10px", marginBottom:"15px"}}>
              <List relaxed divided>
                {attendees.map((attendee) => (
                  <Item key={attendee.userName} style={{ position: 'relative' }}>
                 {attendee.isHost &&
                  <Label
                    style={{ position: 'absolute' }}
                    color='orange'
                    ribbon='right'
                  >
                    Host
                  </Label> 
                  }
                  <Image size='tiny' src={attendee.image  || '/assets/user.png'} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`/profile/${attendee.userName}`}>{attendee.displayName}</Link>
                    </Item.Header>
                    {attendee.isFollowing &&
                     <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                    }
                  </Item.Content>
                </Item>
                ))}
              </List>
            </Segment>  */}
            
          </Fragment>
    )
}

export default observer(ActivityDetailedSideBar)