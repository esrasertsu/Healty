import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Card, Container, Header, Icon, Item, Label, Message, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom';
import { history } from '../..';
import ActivityListItemPlaceholder from '../activities/dashboard/ActivityListItemPlaceHolder';
import { getStatusTranslate } from '../../app/common/util/util';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import LoginForm from '../user/LoginForm';

interface IProps{
    settings?: boolean
}

const OrderList: React.FC<IProps> = ({settings}) => {

  const rootStore = useContext(RootStoreContext);
  const { getOrders, orderList, setOrderPage, orderPage,clearOrderRegistery, totalOrderPages, loadingOrders } = rootStore.activityStore;
  const {isLoggedIn} = rootStore.userStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const handleGetNext = () => {
      debugger;
    setLoadingNext(true);
    setOrderPage(orderPage +1);
    getOrders().then(() => setLoadingNext(false))
  }

  useEffect(() => {
      if(isLoggedIn)
         getOrders();
    //   return () => {
    //     setOrderPage(0);
    //     clearOrderRegistery();
    // }
      
  }, [getOrders,isLoggedIn])

  if(!isLoggedIn)
    return (
      <Container className="pageContainer">

        <Segment className="login-page-segment">
            <LoginForm location={history.location.pathname} />
        </Segment>
        </Container>
    )

  return (
    <Container className={!settings ? "pageContainer" : ""}>

    <Fragment>
     {loadingOrders && orderPage === 0 ? <ActivityListItemPlaceholder/> :
     orderList.length > 0 ?
      <>
      <Segment className="myOrdersHeader" style={!settings ? {marginTop:"40px"} : {}}>
        Rezervasyonlarım
      </Segment>
      {
      orderList.map((order) =>(
        
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
                 <div> Rez No: #
                {
                    order.orderNo
                }
                 </div> 
                 <div>
                    Rez Tarihi: {format(new Date(order.date), 'dd MMMM yyyy, HH:mm',{locale: tr})}
                 </div>
             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
             <div style={{color:getStatusTranslate(order.orderStatus).color}}>
                <span><Icon name={getStatusTranslate(order.orderStatus).icon as SemanticICONS} /> {getStatusTranslate(order.orderStatus).desc}</span> 
             </div>

             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
         <div>
                     Kişi sayısı : {order.count}
                 </div>
                 <div>
                     Fiyat : {Number(order.price)}TL
                 </div>
                 <div>
                    Toplam Ödenen : {Number(order.paidPrice)}TL
                 </div>

             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"} >
         <Item.Description style={{flex:"end"}}>
         <Button
                 onClick={()=> history.push(`/orders/${order.id}`)}
                 floated="right"
                 content="Detay"
                 color="blue"
                 size={isTabletOrMobile ?"mini" :"medium"}
                 className="orderListButton"
                 circular
                 /> 
         </Item.Description>
         </Item.Content>
         </div>
        
 </Item>
        </Item.Group>
        </Segment>
      )
      
      )
    }
      <div style={{display:"flex", justifyContent:"center"}}>
      <Button  
       floated="right"
       className='blue-gradientBtn'
       fluid={isMobile} 
       size="large" disabled={loadingNext || (orderPage +1 >= totalOrderPages)} 
       onClick={()=> handleGetNext()} 
       style={{margin:"20px 0"}}
       circular
     > Daha Fazla Göster </Button>
     </div>
     </>
      :
      <>
      {!isTabletOrMobile && <br></br> }
      <Segment placeholder>
            <Header icon>
                <Icon name="calendar times outline" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <p style={{color:"#1a2b49", fontSize:"16px"}}>Henüz ödeme aşamasına geldiğiniz bir aktivite bulunmamaktadır.</p>
                    <p>
                    <Button onClick={() => history.push("/activities")} circular positive content="Aktivitelere göz at"></Button> 

                    </p>
                </div>
            </Segment.Inline>
        </Segment>
     </>
    }
    </Fragment>
    </Container>

  );
};

export default observer(OrderList)