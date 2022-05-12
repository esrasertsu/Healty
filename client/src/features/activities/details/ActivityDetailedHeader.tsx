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

SwiperCore.use([Navigation,Pagination,Mousewheel,Keyboard]);

const activityImageStyle = {
  filter: 'brightness(50%)',
  height:'350px',
  objectFit: 'cover',
  borderRadius: "0.28571429rem"
};


const ActivityDetailedHeader:React.FC<{activity:IActivity}> = ({activity}) => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const host = activity.attendees && activity.attendees.filter(x => x.isHost === true)[0];

  const rootStore = useContext(RootStoreContext);
  const { cancelAttendance, loading, deleteActivity,changeActivityStatus} = rootStore.activityStore;
  const { getOrders, orderList } = rootStore.activityStore;
  const { user } = rootStore.userStore;

  const [open, setOpen] = React.useState(false);
  const [cancellationUserOpen, setcancellationUserOpen] = React.useState(false);
  const [galleryModal, setGalleryModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0)
  const [openStatusChange, setOpenStatusChange] = useState(false);

  const handleDeleteActivity = (e:any) => {
    //deleteActivity(e,activity.id);
  }

  useEffect(() => {
    getOrders()
   
  }, [activity])

  const handleSendUserToOrders = () =>{

    if(activity.price && activity.price > 0 )
    { debugger;
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
                            <Header
                              as="h2"
                              style={{color:"#222E50"}}
                              content={activity.title}
                            />
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            <div>
                            {(new Date(activity.endDate).getTime() < new Date().getTime()) && 
                            <span><StarRating rating={activity.star} editing={false} size={'small'} showCount={true} count={activity.starCount}/> </span> }
                             <span>Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> </span> 
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
                      {/* <Modal
                        basic
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size='small'
                        trigger={<Button circular
                          color='red' floated='right' content='Sil'
                        labelPosition='right'
                        icon='trash'></Button>}
                      >
                        <Header icon>
                          <Icon name='archive' />
                          Aktivite Silme Onayı
                        </Header>
                        <Modal.Content>
                          <p>
                            Oluşturmuş olduğun bu aktiviteyi silmek istediğine emin misin?
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button circular basic color='grey'  onClick={() => setOpen(false)}>
                            <Icon name='backward' /> İptal
                          </Button>
                          <Button circular basic color='red' onClick={(e:any) => {handleDeleteActivity(e);setOpen(false)}}>
                            <Icon name='trash' /> Sil
                          </Button>
                        </Modal.Actions>
                      </Modal> */}
                    </>                   
                    ): activity.isGoing ? (
                      <Button circular loading={loading} onClick={()=>setcancellationUserOpen(true)}>Katılımı iptal et</Button>
                    ): (
                      <>
                      { 
                      activity.attendancyLimit && (activity.attendancyLimit !==0 && (activity.attendancyLimit>0) && (activity.attendancyLimit - activity.attendanceCount) <4) ?
                     ( activity.attendancyLimit - activity.attendanceCount >0 ?
                       <Label color='red'>Son {activity.attendancyLimit - activity.attendanceCount} katılımcı!</Label>
                       :
                       <Label color='red'>Yer kalmadı!</Label> ) : ""
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
                    <Swiper cssMode={true} navigation={true} pagination={true} mousewheel={true} keyboard={true} className="activitySwiper">
                    {
                      activity.photos.map((photo:IPhoto) =>
                      <SwiperSlide key={photo.id}>
                        <img key={photo.id} src={photo.url} />
                      </SwiperSlide>
                      )
                    }  
                    </Swiper>
                    : 
                    isMobile && activity.photos.length === 0 ?
                    <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} fluid style={activityImageStyle}/>
                    :
                    activity.photos.length > 3?
                    <Grid>
                      <Grid.Row>
                          <Grid.Column width={11}>
                            <Button style={{position:"absolute", margin:"20px"}} className="blueBtn" content={"Tüm resimler (" + activity.photos.length.toString() + ")"}
                            onClick={() => openGalleryModal(0)}/>
                             <img style={{cursor:"pointer", borderRadius: "0.28571429rem"}} className='activityFirstCol_Img' key={activity.photos[0].id} src={activity.photos[0].url}
                             onClick={() => openGalleryModal(0)} />
                          </Grid.Column>
                          <Grid.Column width={5}>
                              <Grid.Row>
                              <img style={{cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_FirstRow_Img' key={activity.photos[1].id} src={activity.photos[1].url}
                               onClick={() => openGalleryModal(1)} />
                              </Grid.Row>
                              <Grid.Row style={{display:"flex",cursor:"pointer"}}>
                              <Grid.Column>
                                <img style={{paddingRight:"5px",cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_SecondRow_Img' key={activity.photos[2].id}
                                 src={activity.photos[2].url}  onClick={() => openGalleryModal(2)} />
                              </Grid.Column>
                              <Grid.Column>
                              <img style={{paddingLeft:"5px",cursor:"pointer",borderRadius: "0.28571429rem"}} className='activitySecondCol_SecondRow_Img' key={activity.photos[3].id} 
                              src={activity.photos[3].url}  onClick={() => openGalleryModal(3)}/>
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
                      <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} onClick={() => openGalleryModal(0)} fluid style={activityImageStyle}/>
                    </div>
                    :
                    <Image src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'} fluid style={activityImageStyle}/>

                    }
                
                  </Segment>
                

                    {isMobile && 
                    <>
                     <Container>
                      <Item.Group>
                        <Item>
                          <Item.Content>
                          <Header
                              as="h1"
                              style={{color:"#222E50"}}
                              content={activity.title}
                            />
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            <p>
                              Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                            {(new Date(activity.endDate).getTime() < new Date().getTime()) && 
                        <div><StarRating rating={activity.star} editing={false} size={'small'} showCount={true} count={activity.starCount}/> </div> }
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Container>
                   { (activity.isHost && host && host.userRole==="Trainer") || (user && user.role==="Admin") ? (
                      <div style={{display:"flex", alignItems:"flex-end", flexDirection:"row",justifyContent: "space-evenly"}}>
                      <Button circular as={Link} to={`/manage/${activity.id}`} color='blue' floated='right' style={{marginTop:"20px"}}
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
                      {/* <Modal
                        basic
                        circular
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size='small'
                        trigger={<Button color='red' floated='right' content='Sil' style={{marginTop:"20px"}}
                        labelPosition='right'
                        icon='trash'></Button>}
                      >
                        <Header icon>
                          <Icon name='archive' />
                          Aktivite Silme Onayı
                        </Header>
                        <Modal.Content>
                          <p>
                            Oluşturmuş olduğun bu aktiviteyi silmek istediğine emin misin?
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button circular basic color='grey' onClick={() => setOpen(false)}>
                            <Icon name='backward' /> İptal
                          </Button>
                           <Button circular basic color='red' onClick={(e:any) => {handleDeleteActivity(e);setOpen(false)}}>
                            <Icon name='trash' /> Sil
                          </Button> 
                        </Modal.Actions>
                      </Modal> */}
                    </div>                   
                    ): activity.isGoing ? (
                      <Button circular style={{marginTop:"20px"}} loading={loading} onClick={()=>setcancellationUserOpen(true)}>Katılımı iptal et</Button>
                    ): (
                      <>
                      { 
                      activity.attendancyLimit && (activity.attendancyLimit !==0 && (activity.attendancyLimit>0) && (activity.attendancyLimit - activity.attendees.length) <4) ?
                      <span style={{color:"red"}}>Son {activity.attendancyLimit - activity.attendees.length} katılımcı!</span> : ""
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