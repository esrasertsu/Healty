import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Segment, List, Item, Label,Image, Header, Divider } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'
import { Scrollbars } from 'react-custom-scrollbars';
import { RootStoreContext } from '../../../app/stores/rootStore'

interface IProps{
  attendees: IAttendee[];
  date: Date;
}
 const ActivityDetailedSideBar: React.FC<IProps> = ({attendees,date}) => {

  const rootStore = useContext(RootStoreContext);

  const { isLoggedIn } = rootStore.userStore;

    return (
          <Fragment>
            <Segment
              textAlign='center'
              style={{ border: 'none' }}
              attached='top'
              inverted
              className="segmentHeader"

            >
             <Header>{attendees && attendees.length} Kişi  
            { (new Date(date).getTime() > new Date().getTime()) ? " Katılıyor" : " Katıldı" } </Header>

            </Segment>
            <Segment attached style={{  padding:"1em 0"}}>
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
            <List relaxed divided style={{margin: "0px 29px 14px 14px"}}>
                {isLoggedIn ?
                attendees.map((attendee) => (
                  <Item key={attendee.userName} style={{ position: 'relative' }}>
                 {attendee.isHost &&
                  <Label
                    style={{ position: 'absolute' }}
                    color='orange'
                    ribbon='right'
                  >
                    Düzenleyen
                  </Label> 
                  }
                  <Image className="activityAttendees_Image" src={attendee.image  || '/assets/user.png'} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`/profile/${attendee.userName}`}>{attendee.displayName}</Link>
                    </Item.Header>
                    {attendee.isFollowing &&
                     <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                    }
                  </Item.Content>
                </Item>
                )) :
                <>
                <Item key={attendees.filter(x => x.isHost === true)[0].userName} style={{ position: 'relative' }}>
                 <Label
                   style={{ position: 'absolute' }}
                   color='orange'
                   ribbon='right'
                 >
                   Düzenleyen
                 </Label> 
                 <Image className="activityAttendees_Image" src={attendees.filter(x => x.isHost === true)[0].image  || '/assets/user.png'} />
                 <Item.Content verticalAlign='middle'>
                   <Item.Header as='h3'>
                     <Link to={`/profile/${attendees.filter(x => x.isHost === true)[0].userName}`}>{attendees.filter(x => x.isHost === true)[0].displayName}</Link>
                   </Item.Header>
                 </Item.Content>
               </Item>
                <Divider />
                <div style={{color:"#263a5e", textAlign:"center"}}>Tüm aktivite katılımcılarını görebilmek için giriş yapmalısın.</div>
                </>
              }
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