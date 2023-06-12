import React, { useContext, useEffect, useState } from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Container, Header, Icon, Image, Item, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';
import { useStore } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'

const PaymentSuccessPage : React.FC<RouteComponentProps> = ({location}) =>{
    const {status,activityId,count, paidPrice, paymentTransactionId} = queryString.parse(location.search);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
    const rootStore = useStore();
    const { activity, loadActivity, loadingActivity } = rootStore.activityStore;
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


   useEffect(() => {
       if(status == "success")
       loadActivity(activityId as string);
   }, [status])

   if(loadingActivity) return <LoadingComponent content='Ödeme işlemi sonucu yükleniyor...'/>  

   if(!activity)
    return (
        <Container className="pageContainer">

        <Segment placeholder>
        <Header icon>
            <Icon name="check" />
        </Header>

        <Segment.Inline>
            <div className="center">
                <p>Satın alma işleminiz başarıyla gerçekleşti.</p>
        </div>
        </Segment.Inline>
        </Segment>
        </Container>
    )

    return(
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon color="green" name="check" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <p>Satın alma işleminiz başarıyla gerçekleşti.</p>
                    <p>Ödeme işlem numaranız: {paymentTransactionId as string}</p>
                </div>
            </Segment.Inline>
        </Segment>
        <p>Rezervasyon/Ödeme Detayları:</p>

         <Segment key={activity.id + "_segment"} className="orderListItem">
         <Item.Group divided>
          <Item key={activity.id} style={{ zIndex: '1' }} className={isMobile? "activityListItem_mobile":""} >
         <div className={isMobile? "activityListItemDiv_mobile":"activityListItemDiv small"} >
             <Item.Image size={!isMobile ? "small":undefined} style={{ display: "block"}} 
                 src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'}
                 className={isMobile ? "activityListItem_Image_mobile":""} >
             </Item.Image>
         </div>
       <div className="orderListItem_content_div">
 
         <Item.Content className={isTabletOrMobile ? "order_listItem_mobile":"order_listItem"} >
             <Item.Header>{activity.title}</Item.Header>
             <Item.Description>
                 <div>

                {
                    activity.online ?  
                    <div style={{marginTop:".6em",display: "flex",alignItems: "center", marginBottom: "7px"}}> 
                   <Image style={{height:"25px", marginRight:"5px",display:"flex", flexDirection:"row", alignItems:"center"}} src="/icons/wifi-ok.png"/>
                    <span>Online katılım</span> </div>
                     :
                   <span>{activity.city ? activity.city.text : "Şehir Belirtilmemiş"} - {activity.venue? activity.venue : "Lokasyon Belirtilmemiş"}</span> 
                }
                 </div> 
                 <div>
                 {format(new Date(activity.date), 'dd MMMM yyyy, HH:mm',{locale: tr})}
                 </div>
                
             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
             <div>
                Düzenleyen: <Link to={`/profile/${activity.attendees.filter(x => x.isHost === true)[0].userName}`} ><strong>{activity.attendees.filter(x => x.isHost === true)[0].displayName}</strong></Link> 
             </div>

             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
         <div>
                     Adet : {count}
                 </div>
                 <div>
                     Ücret : {Number(paidPrice)}TL
                 </div>

             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"} >
         <Item.Description style={{textAlign:"right", display: "flex", justifyContent: "flex-end"}}>
         
         </Item.Description>
         <Item.Description style={{flex:"end"}}>
         <Button
                 as={Link} to={`/activities/${activity.id}`}
                 floated="right"
                 content="Aktivite sayfasına git"
                 className="blueBtn orderListButton"
                 circular
                 /> 
         </Item.Description>
         </Item.Content>
         </div>
        
 </Item>
        </Item.Group>
        </Segment>
        </Container>
    )
};

export default observer(PaymentSuccessPage);

