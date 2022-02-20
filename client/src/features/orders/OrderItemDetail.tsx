import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { RouteComponentProps } from 'react-router'
import { Button, Confirm, Container, Grid, Header, Icon, Image, Item, List, Modal, Segment, Table } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { getStatusTranslate } from '../../app/common/util/util';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { Link } from 'react-router-dom';
import { IRefundPayment } from '../../app/models/activity';
import RefundSuccess from './RefundSuccess';

interface DetailParams{
    id:string
}
const OrderItemDetail:React.FC<RouteComponentProps<DetailParams>>  = ({match, history}) => {

    const rootStore = useContext(RootStoreContext);
    const { getOrderDetails,order,loadingOrder,loadingRefundPaymentPage,refundPayment ,deleteOrder} = rootStore.activityStore;
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
    const [open, setOpen] = useState(false);
    const [removeItemOpen, setRemoveItemOpen] = useState(false);

    const { modal, openModal, closeModal} = rootStore.modalStore;

    useEffect(() => {
        debugger;
        getOrderDetails(match.params.id)
    }, [getOrderDetails, match.params.id]) // sadece 1 kere çalışcak, koymazsak her component render olduğunda
    

   const handleDeleteOrderItem = () =>{
     setOpen(false);
     if(order)
     deleteOrder(order!.id)
   }

   const handlePayOrderItem = () =>{

   }

   const handleRefundPayment = () =>{
       setOpen(false);

       if(order)
        refundPayment(order!.paymentTransactionId,order!.productId, order!.id).then((res)=>{
             if(res)
             {
                if(modal.open) closeModal();
                openModal("", <>
                <Modal.Description className="loginreg">
                <RefundSuccess RefundSuccess={res} />
                </Modal.Description>
                </>,false,
                "","",false) 

             }
        })
   }

   

    if(loadingRefundPaymentPage) return <LoadingComponent content='Rezervasyon iptali bekleniyor...'/>  
    if(loadingOrder) return <LoadingComponent content='Rezervasyon detayı bekleniyor...'/>  

    

    return (
     !order ? 
     <Container className="pageContainer">

     {!isTabletOrMobile && <br></br> }
     <Segment placeholder>
           <Header icon>
               <Icon name="calendar times outline" />
           </Header>
 
           <Segment.Inline>
               <div className="center">
                   <p style={{color:"#1a2b49", fontSize:"16px"}}>Ödeme detayına ulaşılamamaktadır. Lütfen bizimle iletişime geçiniz.</p>
                   <p>
                   </p>
               </div>
           </Segment.Inline>
       </Segment>
    </Container>
    :
    <Container className="pageContainer">
          
        <Confirm
          content='Bu rezervasyonu iptal etmek istediğinize emin misiniz?'
          open={open}
          header="Rezervasyon iptali"
          cancelButton='Geri'
          confirmButton="Rezervasyonu iptal et"
          onCancel={() =>setOpen(false)}
          onConfirm={handleRefundPayment}
        />
         <Confirm
          content='Bu rezervasyonu listenizden çıkartmak istediğinize emin misiniz?'
          open={removeItemOpen}
          header="Bekleyen rezervasyonu sil"
          cancelButton='Geri'
          confirmButton="Rezervasyonu sil"
          onCancel={() =>setRemoveItemOpen(false)}
          onConfirm={handleDeleteOrderItem}
        />
           <Segment className="orderItem_paymentSegment">
               <Grid>
                   <Grid.Row className="orderItem_paymentContainer_GridRow">
                   <Link to="/orders"><Icon name="angle left"/>Tüm Rezervasyonlar</Link>
                   <div className="orderItem_paymentContainer">
                   {
                   (order.orderStatus == "Completed" &&  

                   (
                       ((new Date(order.activityDate).getTime() - new Date().getTime()) / (1000 *3600 *24)) >= 1 )
                   
                   ) &&
                   <Button
                                    onClick={()=> setOpen(true)}
                                    disabled={((new Date(order.activityDate).getTime() - new Date().getTime()) / (1000 *3600 *24)) < 1 }
                                    floated="right"
                                    content="İptal Et"
                                    color="red"
                                    className="orderListButton"
                                    circular

                                    /> 
                   }
                    {
                        
                           order.orderStatus == "Unpaid" &&
                           <>
                          
                           <Button
                           onClick={()=> handlePayOrderItem()}
                           floated="right"
                           content="Şimdi Öde"
                           className="orderListButton orangeBtn"
                           circular
                           /> 
                             <Button
                                    onClick={()=> setRemoveItemOpen(true)}
                                    floated="right"
                                    content="Sil"
                                    basic
                                    color="red"
                                    className="orderListButton"
                                    circular
                                    /> 
                           </>
                       }
                   </div>
                   
               
                   </Grid.Row>
                   

               </Grid>
                
           </Segment>


           <Segment>
           <Grid stackable className="orderItemDetails_grid">
               <Grid.Row columns="6">
                <Grid.Column>
                    <span className="mainHeader">Rezervasyon Detayı</span>
                </Grid.Column>
                <Grid.Column>
                <div className="column_header">
                    <span className="headerItem">Ödeme Tarihi</span>
                    <span className="orderItemDetails_grid_detail">{format(new Date(order.date), 'dd MMMM yyyy, HH:mm',{locale: tr})}</span>
                    </div>
                </Grid.Column>
                <Grid.Column>
                <div className="column_header">
                    <span className="headerItem">Ödeme İşlem No</span>
                    <span className="orderItemDetails_grid_detail">{order.paymentTransactionId}</span>
                    </div>
                </Grid.Column>
                <Grid.Column>
                <div className="column_header">
                    <span className="headerItem">Rez No</span>
                    <span className="orderItemDetails_grid_detail">#{order.orderNo}</span>
                    </div>
                </Grid.Column>
               
                <Grid.Column>
                    <div className="column_header">
                        <span className="headerItem">Katılımcı Sayısı</span>
                        <span className="orderItemDetails_grid_detail">{order.count} kişi</span>
                    </div>
                </Grid.Column>
                <Grid.Column>
                   <div style={{color:getStatusTranslate(order.orderStatus).color}}>
                      <span><Icon name={getStatusTranslate(order.orderStatus).icon as SemanticICONS} /> {getStatusTranslate(order.orderStatus).desc}</span> 
                   </div>
                </Grid.Column>
               </Grid.Row>
           </Grid>
           </Segment>

         

           <Grid stackable>
            <Grid.Row columns="2">
                <Grid.Column>
                    <Segment
                        textAlign='center'
                        attached='top'
                        className="orderItem_BuyerDetails_Header"

                        >
                    <div className="header_text">Alıcı Bilgileri</div>
                    </Segment>
                    <Segment className="orderItem_BuyerDetails_Container" attached >
                    <p>
                       <span style={{color:"#000000b3",textDecoration:"underline"}}>Ad/Soyad:</span>  {order.attendeeName}
                    </p>
                    <p>
                      <span style={{color:"#000000b3",textDecoration:"underline"}}>Tel:</span> {order.phoneNumber}
                    </p>
                    <p>
                    <span style={{color:"#000000b3",textDecoration:"underline"}}>Email:</span> {order.email} 
                    </p>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                     <Segment
                        textAlign='center'
                        attached='top'
                        className="orderItem_BuyerDetails_Header"

                        >
                    <div className="header_text">Ödeme Bilgileri</div>
                    <div className="header_text">{order.cardAssociation}/{order.cardFamily} ****{order.cardLastFourDigit}</div>
                    </Segment>
                    <Segment className="orderItem_PaymentDetails_Container" attached >
                    <div className="item">
                           <span className="title">Fiyat</span>
                           <span className="content">{Number(order.price)} TL</span>
                       </div>
                    <div className="item">
                           <span className="title">Adet</span>
                           <span className="content">{order.count}*</span>
                       </div>
                       <div className="item">
                           <span className="title">İndirim</span>
                           <span className="content">{0} TL</span>
                       </div>
                       <div className="last item">
                           <span style={{fontWeight:"bold"}} className="title">Toplam</span>
                           <span style={{fontWeight:"bold"}} className="content">{Number(order.paidPrice)} TL</span>
                       </div>
                    </Segment>
                   
                </Grid.Column>
            </Grid.Row>
           </Grid>
           
          
           <Segment
                        textAlign='center'
                        attached='top'
                        className="orderItem_BuyerDetails_Header"

                        >
                    <div className="header_text">                              
                    Düzenleyen: <Link to={`/profile/${order.trainerId}`} >{order.trainerId}</Link> 
                    </div>
                    <div className="header_text">
                        <span className="orderItem_review" >Uzmanı Değerlendir <Icon name="star outline"></Icon></span>
                    </div>
                    </Segment>
                            <Segment className="orderItem_BuyerDetails_Container" attached >
                            <Segment key={order.id + "_segment"} className="orderListItem">
                            <Item.Group divided>
                            <Item key={order.id} style={{ zIndex: '1' }} className={isMobile? "activityListItem_mobile":""} >
                            <div className={isMobile? "activityListItemDiv_mobile":"activityListItemDiv"} >
                                <Item.Image size={!isMobile ? "small":undefined} style={{ display: "block"}} 
                                    src={(order.photo && order.photo) || '/assets/placeholder.png'}
                                    className={isMobile ? "activityListItem_Image_mobile":""} >
                                </Item.Image>
                            </div>
                        <div className="orderListItem_content_div">
                    
                        <Item.Content className={isMobile ? "order_listItem_mobile":"order_listItem"} >
                            <Item.Header>{order.title}</Item.Header>
                            <Item.Description>
                                <div>
                                Seviye:
                        {
                                    order.activityLevel && order.activityLevel.length> 0 ? 
                                    order.activityLevel.map<React.ReactNode>(s => <span key={s}>{s}</span>).reduce((prev, cur) => [prev, ',', cur])
                                    : " Bilgi yok"
                                }
                                </div>
                           
                                Kategori:
                               {
                                    order.activityCategories && order.activityCategories.length> 0 ? 
                                    order.activityCategories.map<React.ReactNode>(s => <span key={s}>{s}</span>).reduce((prev, cur) => [prev, ',', cur])
                                    : " Bilgi yok"
                                }
                               
                            </Item.Description>
                        </Item.Content>
                        <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
                        <Item.Description>
                        <div>
                            {format(new Date(order.activityDate), 'dd/MM/yyyy,HH:mm',{locale: tr})}
                                </div>
                            </Item.Description>
                        </Item.Content>
                        <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
                        <Item.Description>
                        {order.activityOnline ?  <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>  <Image style={{height:"25px", marginRight:"5px"}} src="/icons/wifi-ok.png"/>
                        <span>Online katılım</span> <Icon name='check' size='small' color='green' /> </div>:
                         <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                             <Icon name='map marker alternate' color="red"/><span>Online katılıma kapalı</span></div>}
                            </Item.Description>
                        </Item.Content>
                        <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"} >
                       
                        <Item.Description style={{flex:"end"}}>
                        <Button
                                onClick={()=> history.push(`/activities/${order.productId}`)}
                                floated="right"
                                content="İncele"
                                className="blueBtn orderListButton"
                                circular
                                /> 
                        </Item.Description>
                        </Item.Content>
                        </div>
                            
                    </Item>
                            </Item.Group>
                            </Segment>
                    </Segment>
        </Container>
    )
}


export default observer(OrderItemDetail)
