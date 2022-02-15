import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Segment, List, Item, Label,Image, Header, Divider } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'
import { Scrollbars } from 'react-custom-scrollbars';
import { RootStoreContext } from '../../../app/stores/rootStore'

interface IProps{
  atCount:number;
  attendees: IAttendee[];
  date: Date;
}
 const ActivityDetailedSideBar: React.FC<IProps> = ({atCount, attendees,date}) => {

  const rootStore = useContext(RootStoreContext);

  const { isLoggedIn } = rootStore.userStore;

    return (
      
          <div style={{marginTop:"50px"}}>
          
             <Header>  
            <><span>
               { atCount }  Kişi  { (new Date(date).getTime() > new Date().getTime()) ? " Katılıyor" : " Katıldı" }
            </span> 
            <br></br>
            <span style={{fontSize:"12px"}}>* Sadece takip ettiğin kullanıcılar listelenmektedir.</span> </>
             </Header>
             

            <Segment attached style={{  padding:"1em 0"}}>
            <Scrollbars
             frameBorder="2px" 
             style={{ 
               backgroundColor:"white", 
               maxHeight: "340px", 
               minHeight:"130px"
             //  width: "calc(100% - (-1px * 2))", 
              // maxWidth: "calc(100% - (-1px * 2))",
               }}
             autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
             >
            <List relaxed divided style={{margin: "0px 31px 14px 14px"}}>
                {isLoggedIn ?
                attendees.filter(x => x.isHost === false).map((attendee) => (
                  <Item key={attendee.userName} style={{ position: 'relative' }}>
                 {/* {attendee.isHost &&
                  <Label
                    style={{ position: 'absolute' }}
                    color='orange'
                    ribbon='right'
                  >
                    Düzenleyen
                  </Label> 
                  } */}
                  <Image className="activityAttendees_Image" src={attendee.image  || '/assets/user.png'} 
                   onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}/>
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`/profile/${attendee.userName}`}>{attendee.displayName}</Link>
                    </Item.Header>
                    {attendee.isFollowing &&
                     <Item.Extra style={{ color: 'orange' }}>Takip Ettiğin</Item.Extra>
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
                 <Image className="activityAttendees_Image" src={attendees.filter(x => x.isHost === true)[0].image  || '/assets/user.png'}
                  onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}} />
                 <Item.Content verticalAlign='middle'>
                   <Item.Header as='h3'>
                     <Link to={`/profile/${attendees.filter(x => x.isHost === true)[0].userName}`}>{attendees.filter(x => x.isHost === true)[0].displayName}</Link>
                   </Item.Header>
                 </Item.Content>
               </Item>
                <Divider style={{marginTop:"5px",marginBottom:"5px"}}/>
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
            
          </div>
        
    )
}

export default observer(ActivityDetailedSideBar)