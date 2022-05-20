import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Image, Container, Icon, Card, Item, Modal, Popup, Divider } from 'semantic-ui-react'
import { useMediaQuery } from 'react-responsive'
import tr  from 'date-fns/locale/tr'
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { history } from '../../..';
import LoginForm from '../../user/LoginForm';
import { BsFillBookmarkStarFill } from 'react-icons/bs';


const ActivitySuggestions:React.FC<{activity:IActivity}> = ({activity}) => {

  const rootStore = useContext(RootStoreContext);
  const { activitySuggestions} = rootStore.activityStore;
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const host = activity.attendees.filter(x => x.isHost === true)[0];

  const {isLoggedIn,user} = rootStore.userStore;
  const {save,unsave} = rootStore.activityStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;

  const handleLoginClick = (e:any,str:string) => {
    
    if(modal.open) closeModal();

        openModal("Giriş Yap", <>
        <Image  size={isMobile ? 'big': isTabletOrMobile ? 'medium' :'large'} src='/assets/Login1.jpg'  wrapped />
        <Modal.Description className="loginreg">
        <LoginForm location={str} />
        </Modal.Description>
        </>,true,
        "","blurring",true, "loginModal") 
    }
  
  const handleSave = (e:any,id:string) =>{
    e.stopPropagation();
    if(isLoggedIn)
    {
      save(id).then(() =>{
        activity.isSaved = true;
      })
    }else{
      var str = `/activities/${id}`;
      handleLoginClick(null,str);
    }
  }

  
  const handleUnSave = (e:any,id:string) =>{
    e.stopPropagation();
    if(isLoggedIn)
    {
      unsave(id).then(() =>{
        activity.isSaved = false;
      })
    }else{
        var str = `/activities/${id}`;
        handleLoginClick(null,str);
    }
  }

    return (
           <>
            <Divider clearing />
           
            <h2>Bunları da görmelisin</h2>
             <Card.Group itemsPerRow={isTabletOrMobile?"3":"5"} stackable>
                {
                    activitySuggestions.map((activity,index) => (
                      index< (isTabletOrMobile? 3 : 5) &&
                        <Card
                        as={Link}
                        to={`/activities/${activity.id}`}
                        key={activity.id}
                      >
                     {   (!activity.isHost) && 
                        <Popup
                      hoverable
                      position="top center"
                      on={['hover', 'click']}
                      positionFixed
                      content="Kaydet"
                      key={activity.id + Math.random() + "subPopover"}
                      trigger={<BsFillBookmarkStarFill
                        className={activity.isSaved ? 'activity_addToFav_mobile suggested saved' : 'activity_addToFav_mobile suggested'}
                        onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)} />} />
  
                    }  
                        <Image
                         src={activity.mainImage? activity.mainImage.url : '/assets/placeholder.png'} 
                         onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}
                          style={{ height: 100, objectFit: 'cover',width:"100%" }}
                        />
                        <Card.Content>
                          <Card.Header className="profileBlogCard_header" textAlign="left">{activity.title}</Card.Header>
                          <Card.Meta textAlign="left">
                            <div><span>{format(new Date(activity.date), 'dd LLL yyyy',{locale: tr})}</span></div>
                          </Card.Meta>
                          <Card.Description>
                          <Item.Image key={host.image} size="mini" style={{width:"20px"}} circular 
                            src={host.image || '/assets/user.png'}
                            onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}
                            />
                             &nbsp;<span style={{fontSize:"14px"}}>{host.displayName}</span>
                          {/* {
                           <span><Icon name='bookmark' /> {activity.savedCount}  </span> 
                          } */}
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    ))
                }
                </Card.Group>
                <Container className="blog_morefromuser_readmore">
                <div onClick={()=>
              {
               

                history.push('/activities')}}>
                      <p className="blogListItem_Readmore">Devamını gör <Icon name='arrow right' /> </p>
                </div>
                </Container>
                
                </>
    )
}

export default observer(ActivitySuggestions)