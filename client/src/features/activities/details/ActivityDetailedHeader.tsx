import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Item, Header, Button, Image, Modal, Icon, Confirm, Container, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
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
  const { attendActivity, cancelAttendance, loading, deleteActivity} = rootStore.activityStore;
  const { getOrders, orderList } = rootStore.activityStore;
  const { user } = rootStore.userStore;

  const [open, setOpen] = React.useState(false);
  const [cancellationUserOpen, setcancellationUserOpen] = React.useState(false);
  const [galleryModal, setGalleryModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0)

  const handleDeleteActivity = (e:any) => {
    debugger;
    deleteActivity(e,activity.id);
  }

  useEffect(() => {
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
  
  

    return (
      <>
        {galleryModal && 
         <ActivityGalleryModal currentImageIndex={imageIndex} onClose={onGalleryModalClose} images={activity.photos} /> 
        }
        <Confirm
          content={'Bu rezervasyonu iptal etmek istediğinize emin misiniz?'}
          open={cancellationUserOpen}
          header="Rezervasyon iptali"
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
                              as="h1"
                              style={{color:"#263a5e"}}
                              content={activity.title}
                            />
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            <p>
                              Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                          </Item.Content>
                        </Item>
                        <Item style={{display:"flex", justifyContent:"end"}}>
                        {(activity.isHost && host && host.userRole==="Trainer") || (user && user.role==="Admin") ? (
                      <>
                      <Button as={Link} to={`/manage/${activity.id}`} color='green' floated='right'
                      content='Düzenle'
                      labelPosition='right'
                      icon='edit'
                      circular>
                      </Button>
                      <Modal
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
                      </Modal>
                    </>                   
                    ): activity.isGoing ? (
                      <Button circular loading={loading} onClick={()=>setcancellationUserOpen(true)}>Katılımı iptal et</Button>
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
                            <Button style={{position:"absolute", margin:"20px"}} color='blue' content={"Tüm resimler (" + activity.photos.length.toString() + ")"}
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
                      <Button style={{position:"absolute", margin:"20px", zIndex:"5"}} color='blue' content={"Tüm resimler (" + activity.photos.length.toString() + ")"}
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
                              style={{color:"#263a5e"}}
                              content={activity.title}
                            />
                            <p>{activity.date && format(activity.date,'dd MMMM yyyy, eeee',{locale: tr})}</p>
                            <p>
                              Düzenleyen: <Link to={`/profile/${host && host.userName}`} ><strong>{host && host.displayName}</strong></Link> 
                            </p>
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Container>
                   { (activity.isHost && host && host.userRole==="Trainer") || (user && user.role==="Admin") ? (
                      <>
                      <Button circular as={Link} to={`/manage/${activity.id}`} color='green' floated='right' style={{marginTop:"20px"}}
                      content='Düzenle'
                      labelPosition='right'
                      icon='edit'>
                      </Button>
                      <Modal
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
                      </Modal>
                    </>                   
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