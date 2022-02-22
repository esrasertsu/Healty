import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Card, Container, Header, Icon, Item, Label, Step, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { RootStoreContext } from '../../../app/stores/rootStore';
import LoginForm from '../../user/LoginForm';
import { history } from '../../..';
import ActivityListItemPlaceholder from '../dashboard/ActivityListItemPlaceHolder';

interface IProps{
    settings?: boolean
}

const TrainerActivityPage: React.FC<IProps> = ({settings}) => {

  const rootStore = useContext(RootStoreContext);
  const { getTrainerActivities, personalActivityList, setPersonalActivityPage, personalActivityPage,clearPersonalActRegistery, totalPersonalActPages, loadingActivity,
    personalActStatus, setPersonalActStatus } = rootStore.activityStore;
  const {isLoggedIn} = rootStore.userStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const handleGetNext = () => {
      debugger;
    setLoadingNext(true);
    setPersonalActivityPage(personalActivityPage +1);
    getTrainerActivities().then(() => setLoadingNext(false))
  }

  useEffect(() => {
      if(isLoggedIn)
      getTrainerActivities();
    //   return () => {
    //     setOrderPage(0);
    //     clearOrderRegistery();
    // }
      
  }, [getTrainerActivities,isLoggedIn])

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
     {loadingActivity && personalActivityPage === 0 ? <ActivityListItemPlaceholder/> :
     personalActivityList.length > 0 ?
      <>
      <Segment className="myOrdersHeader" style={!settings ? {marginTop:"40px"} : {}}>
        Aktivitelerim
      </Segment>
      {
      personalActivityList.map((activity) =>(
        <>
        
        <Segment key={activity.id + "_segment"} className="orderListItem">
         <Item.Group divided>
          <Item key={activity.id} style={{ zIndex: '1' }} className={isMobile? "activityListItem_mobile":""} >
         <div className={isMobile? "activityListItemDiv_mobile":"activityListItemDiv"} >
             <Item.Image size={!isMobile ? "small":undefined} style={{ display: "block"}} 
                 src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'}
                 className={isMobile ? "activityListItem_Image_mobile":""} >
             </Item.Image>
         </div>
       <div className="orderListItem_content_div">
 
         <Item.Content className={isMobile ? "order_listItem_mobile":"order_listItem"} >
             <Item.Header>{activity.title}</Item.Header>
             <Item.Description>
                 <div>
                 Tarih: {format(new Date(activity.date), 'dd MMMM yyyy, HH:mm',{locale: tr})} - {format(new Date(activity.endDate), 'dd MMMM yyyy, HH:mm',{locale: tr})}
                 </div>
             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
             {/* <div style={{color:getStatusTranslate(order.orderStatus).color}}>
                <span><Icon name={getStatusTranslate(order.orderStatus).icon as SemanticICONS} /> {getStatusTranslate(order.orderStatus).desc}</span> 
             </div> */}

             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
         <div>
                     Katılımcı sayısı : {activity.attendanceCount}
                 </div>
                 <div>
                     Katılımcı limiti : {activity.attendancyLimit?activity.attendancyLimit : "Sınırsız" }
                 </div>
                 <div>
                    Bilet Fiyatı : {Number(activity.price)}TL
                 </div>
             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description>
         <div>
                    Durum : {String(activity.status)}
                 </div>
                 
             </Item.Description>
         </Item.Content>
         <Item.Content className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"} >
         <Item.Description style={{flex:"end"}}>
         <Button
                 onClick={()=> history.push(`/activity/${activity.id}`)}
                 floated="right"
                 content="Detay"
                 size={isTabletOrMobile ?"mini" :"medium"}
                 className="orderListButton orangeBtn"
                 circular
                 /> 
         </Item.Description>
         </Item.Content>
         </div>
        
 </Item>
        </Item.Group>
        </Segment>
        </>
      )
      
      )
    }
      <div style={{display:"flex", justifyContent:"center"}}>
      <Button  
       floated="right"
       className='orangeBtn'
       fluid={isMobile} 
       size="large" disabled={loadingNext || (personalActivityPage +1 >= totalPersonalActPages)} 
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
                    <p style={{color:"#1a2b49", fontSize:"16px"}}>Henüz açmış olduğunuz bir aktivite bulunmamaktadır.</p>
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

export default observer(TrainerActivityPage)