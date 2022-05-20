import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Item, Header, Button, Image, Modal, Icon, Confirm, Container, Grid, Label } from 'semantic-ui-react'
import { ActivityStatus, IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import tr  from 'date-fns/locale/tr'
import { history } from '../../..';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import SwiperCore, {
  Pagination,Navigation,Mousewheel,Keyboard
} from 'swiper';
import { IPhoto } from '../../../app/models/profile';
import { useMediaQuery } from 'react-responsive';
import ActivityGalleryModal from './ActivityGalleryModal';
import { StarRating } from '../../../app/common/form/StarRating';
import { BsStar } from "react-icons/bs";
import LoginForm from '../../user/LoginForm';

SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);

const activityImageStyle = {
  filter: 'brightness(50%)',
  height:'350px',
  objectFit: 'cover',
  borderRadius: "0.28571429rem"
};


const ActivityDetailedHeader:React.FC<{activity:IActivity}> = ({activity}) => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })

  const host = activity.attendees && activity.attendees.filter(x => x.isHost === true)[0];

  const rootStore = useContext(RootStoreContext);
  const { cancelAttendance, loading, deleteActivity,changeActivityStatus} = rootStore.activityStore;
  const { getOrders, orderList } = rootStore.activityStore;
  const {isLoggedIn,user} = rootStore.userStore;
  const {save,unsave} = rootStore.activityStore;
  const {openModal,closeModal,modal} = rootStore.modalStore;

  const [open, setOpen] = React.useState(false);
  const [cancellationUserOpen, setcancellationUserOpen] = React.useState(false);
  const [galleryModal, setGalleryModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0)
  const [openStatusChange, setOpenStatusChange] = useState(false);

  const handleDeleteActivity = (e:any) => {
    //deleteActivity(e,activity.id);
  }

  useEffect(() => {
    if(user && isLoggedIn)
      getOrders()
   
  }, [activity])

  const handleSendUserToOrders = () =>{

    if(activity.price && activity.price > 0 )
    {
      if(orderList.length > 0)
      {
          const relatedOrder = orderList.find(x=> x.productId === activity.id);
          if(relatedOrder){
  
            history.push(`/orders/${relatedOrder.id}`)
  
          }else{
            toast.warning("Rezervasyon detayını şuan getiremiyoruz. Lütfen rezervasyonlarım sayfasından deneyiniz.");
            setcancellationUserOpen(false)
          }
      }

    }else{
      cancelAttendance();
      setcancellationUserOpen(false)
    }
    }


    const onGalleryModalClose = () => {
      setGalleryModal(false);
    }
  
    const openGalleryModal = (index:number) => {
        setImageIndex(index);
        setGalleryModal(true);

    }

    const handleCloseStatusChange = () => {
      setOpenStatusChange(false);
    };
    const confirmActivityStatusChange = () => {
      changeActivityStatus(activity.id, ActivityStatus.TrainerCompleteApproved).then(() =>
      handleCloseStatusChange()
      )
     
    };

    
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
        {galleryModal && 
         <ActivityGalleryModal currentImageIndex={imageIndex} onClose={onGalleryModalClose} images={activity.photos} /> 
        }
        <Confirm
          key={"statusChange"}
          content={'Aktivitenizin tamamlandığını onaylıyor musunuz?'}
          open={openStatusChange}
          header="Aktivite Tamamlandı Onayı"
          confirmButton="Evet, Tamamlandı!"
          cancelButton="Geri"
          size='mini'
          onCancel={() =>setOpenStatusChange(false)}
          onConfirm={confirmActivityStatusChange}
        />

    <Confirm
          key={"cancellationRez"}
          content={'Bu rezervasyonu iptal etmek istediğinize emin misiniz?'}
          open={cancellationUserOpen}
          header="Rezervasyon iptali"
          size='mini'
          confirmButton="Devam et"
          cancelButton="Geri"
          onCancel={() =>setcancellationUserOpen(false)}
          onConfirm={handleSendUserToOrders}
        />
        <div>
          {
            !isMobile &&
                 <Container className='activityHeader'>
                      <Item.Group>
                        <Item>
                          <Item.Content>
                            <h1
                              className='activity-title'
                            >{activity.title}</h1>
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            <p>Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> </p> 
                            <div>
                            {/* {(new Date(activity.endDate).getTime() < new Date().getTime()) &&  */}
                            <span>
                              <StarRating 
                              rating={activity.star} 
                              editing={false} 
                              size={'small'} 
                              showCount={true} 
                              count={activity.starCount}
                              showCountSide={true}
                              /> 
                              </span> 
                            </div>
                          </Item.Content>
                        </Item>
                        <Item style={{display:"flex", alignItems:"flex-end", flexDirection:"column"}}>
                        {(activity.isHost && host && host.userRole==="Trainer") || (user && user.role==="Admin") ? (
                      <>
                     
                      <Button as={Link} to={`/manage/${activity.id}`} color='blue' floated='right'
                      style={{marginBottom:"10px"}}
                      content='Düzenle'
                      labelPosition='right'
                      icon='edit'
                      circular>
                      </Button>
                      {(new Date(activity.endDate).getTime() < new Date().getTime()) && activity.status === ActivityStatus.Active &&
                      <Button onClick={() => setOpenStatusChange(true)} color='green' floated='right'
                      content='Tamamlandı onayı!'
                      labelPosition='right'
                      icon="check"
                      circular>
                      </Button>}
                     
                    </>                   
                    ): (
                      <>
                      { 
                      activity.attendancyLimit && (activity.attendancyLimit !==0 && (activity.attendancyLimit>0) && (activity.attendancyLimit - activity.attendanceCount) <4) ?
                     ( activity.attendancyLimit - activity.attendanceCount >0 ?
                       <div className='almost-sell-out-label'>Son {activity.attendancyLimit - activity.attendanceCount} katılımcı!</div>
                       :
                       <div className="almost-sell-out-label">Üzgünüz yer kalmadı</div> ) : ""
                      }
                      {/* {
                      (activity.attendancyLimit ===null ||activity.attendancyLimit ===0 || (activity.attendancyLimit && (activity.attendancyLimit > activity.attendees.length))) &&
                      <Button  floated='right' loading={loading} onClick={attendActivity} color='teal'>Aktiviteye Katıl</Button>
                      }    */}
                      
                      </>
                    )}
                        </Item>
                      </Item.Group>
                    </Container>
                  }
                  
                  <Segment basic className='activityGallery'  style={{ padding: '0' }}>
                    { isMobile && activity.photos.length > 0?
                    <div>
                        <Button style={{position:"absolute", margin:"20px",zIndex:"5",right:"0"}} className="whiteBtn"
                           onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)}
                           ><span style={{marginRight:"5px"}}>{activity.isSaved ? "Favorilerimden Çıkar" : "Favorilere Ekle"}</span>&nbsp;<Icon name='star'/></Button>
                    <Swiper cssMode={true} navigation={true} pagination={true} mousewheel={true} keyboard={true} className="activitySwiper">
                    {
                      activity.photos.map((photo:IPhoto) =>
                      <SwiperSlide key={photo.id}>
                        <img key={photo.id} src={photo.url} onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}} />
                      </SwiperSlide>
                      )
                    }  
                    </Swiper>
                    </div>
                    
                   
                    : 
                    isMobile && activity.photos.length === 0 ?
                    <div>
                       <Button style={{position:"absolute", margin:"20px",zIndex:"5",right:"0"}} className="whiteBtn"
                           onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)}
                           ><span style={{marginRight:"5px"}}>{activity.isSaved ? "Favorilerimden Çıkar" : "Favorilere Ekle"}</span>&nbsp;<Icon name='star'/></Button>
                      <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} 
                      fluid style={activityImageStyle}
                      onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}/>

                            </div>
                    :
                    activity.photos.length > 3?
                    <Grid>
                      <Grid.Row>
                          <Grid.Column width={11}>
                            <Button style={{position:"absolute", margin:"20px"}} className="blueBtn" content={"Tüm resimler (" + activity.photos.length.toString() + ")"}
                            onClick={() => openGalleryModal(0)}/>
                             <img style={{cursor:"pointer", borderRadius: "0.28571429rem"}} className='activityFirstCol_Img' key={activity.photos[0].id} src={activity.photos[0].url}
                             onClick={() => openGalleryModal(0)}
                             onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}} />
                          </Grid.Column>
                          <Grid.Column width={5}>
                              <Grid.Row>
                              <Button style={{position:"absolute", margin:"20px",zIndex:"5",right:"0"}} className="whiteBtn"
                           onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)}
                           ><span style={{marginRight:"5px"}}>{activity.isSaved ? "Favorilerimden Çıkar" : "Favorilere Ekle"}</span>&nbsp;<Icon name='star'/></Button> 
                              <img style={{cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_FirstRow_Img' key={activity.photos[1].id} src={activity.photos[1].url}
                               onClick={() => openGalleryModal(1)} 
                               onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}/>
                              </Grid.Row>
                              <Grid.Row style={{display:"flex",cursor:"pointer"}}>
                              <Grid.Column>
                               <img style={{paddingRight:"5px",cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_SecondRow_Img' key={activity.photos[2].id}
                                 src={activity.photos[2].url}  onClick={() => openGalleryModal(2)}
                                 onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}} />
                              </Grid.Column>
                              <Grid.Column>
                              <img style={{paddingLeft:"5px",cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_SecondRow_Img' key={activity.photos[3].id} 
                              src={activity.photos[3].url}  onClick={() => openGalleryModal(3)}
                              onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}/>
                              </Grid.Column>
                          </Grid.Row>
                          </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    :
                    activity.photos.length > 0?
                    <div>
                      <Button style={{position:"absolute", margin:"20px", zIndex:"5"}} className="blueBtn" content={"Tüm resimler (" + activity.photos.length.toString() + ")"}
                      onClick={() => openGalleryModal(0)}/>
                       <Button style={{position:"absolute", margin:"20px",zIndex:"5",right:"0"}} className="whiteBtn"
                           onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)}
                           ><span style={{marginRight:"5px"}}>{activity.isSaved ? "Favorilerimden Çıkar" : "Favorilere Ekle"}</span>&nbsp;<Icon name='star'/></Button>
                      <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} 
                      onClick={() => openGalleryModal(0)} fluid style={activityImageStyle}
                      onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}/>
                    </div>
                    :
                    <div>
                      <Button style={{position:"absolute", margin:"20px",zIndex:"5",right:"0"}} className="whiteBtn"
                           onClick={(e: any) => activity.isSaved ? handleUnSave(e, activity.id) : handleSave(e, activity.id)}
                           ><span style={{marginRight:"5px"}}>{activity.isSaved ? "Favorilerimden Çıkar" : "Favorilere Ekle"}</span>&nbsp;<Icon name='star'/></Button>
                       <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} 
                       fluid style={activityImageStyle}
                       onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/placeholder.png'}}/>

                    </div>

                    }
                
                  </Segment>
                

                    {isMobile && 
                    <>
                        <Item style={{margin:"15px 0"}}>
                          <Item.Content>
                          <h1 className='activity-title'>
                             {activity.title}
                           </h1>
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            {/* {(new Date(activity.endDate).getTime() < new Date().getTime()) &&  */}
                        <div className='activity__mobile-pricing'>
                            <div>
                          <p>
                              Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                            <StarRating 
                          rating={activity.star} 
                          editing={false} 
                          size={'small'} 
                          showCount={true} 
                          count={activity.starCount}
                          showCountSide={true}/>
                            </div>
                         
                          <div className="baseline-pricing">
                              <p className="baseline-pricing__from">Kişi başı</p> 
                          <div className="baseline-pricing__container">
                          <p className="baseline-pricing__value">
                              {activity.price}&nbsp;TL
                              </p>
                              </div> 
                              <p className="baseline-pricing__category">
                          {/* 'den başlayan fiyatlarla */}
                      </p>
                      </div>
                           </div> 
                          </Item.Content>
                        </Item>
                   { (activity.isHost && host && host.userRole==="Trainer") || (user && user.role==="Admin") ? (
                      <div style={{display:"flex", alignItems:"flex-end", flexDirection:"row",justifyContent: "space-evenly"}}>
                      <Button circular as={Link} to={`/manage/${activity.id}`} color='blue' floated='right' 
                      style={isMobile ? {width:"100%"}: {marginTop:"20px"}}
                      content='Düzenle'
                      labelPosition='right'
                      icon='edit'>
                      </Button>
                      {(new Date(activity.endDate).getTime() < new Date().getTime()) && activity.status === ActivityStatus.Active &&
                      <Button  onClick={() => setOpenStatusChange(true)} color='green' floated='right'
                      content='Tamamlandı onayı!'
                      labelPosition='right'
                      icon="check"
                      circular>
                      </Button>}
                    </div>                   
                    ): (
                      <>
                      { 
                        activity.attendancyLimit && (activity.attendancyLimit !==0 && (activity.attendancyLimit>0) && (activity.attendancyLimit - activity.attendanceCount) <4) ?
                       ( activity.attendancyLimit - activity.attendanceCount >0 ?
                        <div className='almost-sell-out-label'>Son {activity.attendancyLimit - activity.attendanceCount} katılımcı!</div>
                         :
                         <div className='almost-sell-out-label'>Üzgünüz yer kalmadı</div> ):""
                        }
                      {/* {
                      (activity.attendancyLimit ===null ||activity.attendancyLimit ===0 || (activity.attendancyLimit && (activity.attendancyLimit > activity.attendees.length))) &&
                      <Button  floated='right' loading={loading} onClick={attendActivity} color='teal'>Aktiviteye Katıl</Button>
                      }    */}
                      
                      </>
                    )}
                    </>
                    }

       
        </div>
    </>
    )
}

export default observer(ActivityDetailedHeader)