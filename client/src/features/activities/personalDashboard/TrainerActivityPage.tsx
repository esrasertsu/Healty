import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Card, Container, Header, Icon, Item, List, Progress, Segment } from 'semantic-ui-react'
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
import { ActivityStatus } from '../../../app/models/activity';

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
    setLoadingNext(true);
    setPersonalActivityPage(personalActivityPage +1);
    getTrainerActivities().then(() => setLoadingNext(false))
  }

  const getPercentStatus = (status:string): number =>{
     
    if(status === ActivityStatus.UnderReview.toString())
    return 0;
    else if(status === ActivityStatus.Active.toString())
      return 33;
    else if(status === ActivityStatus.PassiveByAdmin.toString())
      return 0;
    else if(status === ActivityStatus.TrainerCompleteApproved.toString())
      return 66;
    else if(status === ActivityStatus.AdminPaymentApproved.toString())
      return 100;
    return 0;
  }

  const getPercentText = (status:string) =>{
    if(status === ActivityStatus.UnderReview.toString())
      return <><Icon key="search" name="search" /><span>Değerlendirme</span></>;
    else if(status === ActivityStatus.Active.toString())
      return <><Icon key="check" color="orange" name="check" /><span>Aktif</span></>;
    else if(status === ActivityStatus.PassiveByAdmin.toString())
      return <span>Donduruldu</span>;
    else if(status === ActivityStatus.TrainerCompleteApproved.toString())
      return <><Icon key="clock" name="clock outline" color="blue"/><span>Ödeme onayı bekleniyor</span></>;
    else if(status === ActivityStatus.AdminPaymentApproved.toString())
      return <><Icon key="money" name="money bill alternate outline" color="green" /><span>Ödeme onaylandı</span></>;
    return "";
  }
  useEffect(() => {
      if(isLoggedIn)
      getTrainerActivities();
      return () => {
        setPersonalActivityPage(0);
        clearPersonalActRegistery();
    }
      
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
      <Segment key="myOrdersHeader"  className="myOrdersHeader" style={!settings ? {marginTop:"40px"} : {}}>
        <Header key="h2" as="h2">Aktivitelerim</Header>
        <div key="header_info" className='header_info'>
        <p key="desc">Açmış olduğunuz aktivitelerin süreçlerini bu sayfada takip edebilirsiniz. Aktiviler sırasıyla şu aşamaları tamamlamaktadır:</p>
        <List>
          <List.Item key="review">
            <List.Icon key="reviewIcon" name='search' />
            <List.Content key="reviewCont">Değerlendirme</List.Content>
          </List.Item>
          <List.Item key="active">
            <List.Icon key="activeIcon" name="check" color='orange' />
            <List.Content key="activeCont">Aktif</List.Content>
          </List.Item>
          <List.Item key="paymentInfo">
            <List.Icon key="userIcon" name='user' color='blue' />
            <List.Content key="userCont">Admin ödeme onayı bekleniyor. (**Bu aşamaya geçebilmek için lütfen aktivite tamamlandığını aktivite üzerindeki buton ile bildir.)</List.Content>
          </List.Item>
          <List.Item key="paymentApprove">
            <List.Icon key="handshakeIcon" name="handshake outline" color="green"/>
            <List.Content key="paymentCont">Ödeme Onaylandı.</List.Content>
          </List.Item>
        </List>
        </div>
      </Segment>
      {
      personalActivityList.map((activity) =>(
        <>
        
        <Segment key={activity.id + "_segment"} className="orderListItem">
         <Item.Group divided key={activity.id + "_itemGroup"}>
          <Item key={activity.id + "_activityListItem"} style={{ zIndex: '1' }} className={isMobile? "activityListItem_mobile":""} >
         <div key={activity.id + "_activityListItemDiv"} className={isMobile? "activityListItemDiv_mobile":"activityListItemDiv small"} >
             <Item.Image key={activity.id + "img"} size={!isMobile ? "small":undefined} style={{ display: "block"}} 
                 src={(activity.mainImage && activity.mainImage.url) || '/assets/placeholder.png'}
                 className={isMobile ? "activityListItem_Image_mobile":""} >
             </Item.Image>
         </div>
       <div key={"orderListItem_content_div"} className="orderListItem_content_div">
 
         <Item.Content  key={activity.id + "title"}  className={isMobile ? "order_listItem_mobile":"order_listItem"} >
             <Item.Header key={activity.id + "titleHeader"} >{activity.title}</Item.Header>
             <Item.Description key={activity.id + "desc"} >
                 <div key={activity.id + "date"}>
                 Tarih: {format(new Date(activity.date), 'dd MMMM yyyy, HH:mm',{locale: tr})} - {format(new Date(activity.endDate), 'dd MMMM yyyy, HH:mm',{locale: tr})}
                 </div>
             </Item.Description>
         </Item.Content>
        
         <Item.Content  key={activity.id + "extra"} className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description key={activity.id + "extradesc"}>
         <div key={activity.id + "attCount"}>
                     Katılımcı sayısı : {activity.attendanceCount}
                 </div>
                 <div key={activity.id + "limit"}>
                     Katılımcı limiti : {activity.attendancyLimit?activity.attendancyLimit : "Sınırsız" }
                 </div>
                 <div key={activity.id + "price"}>
                    Bilet Fiyatı : {Number(activity.price)}TL
                 </div>
             </Item.Description>
         </Item.Content>
         <Item.Content key={activity.id + "status"} className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"}>
         <Item.Description key={activity.id + "statusDesc"}>
         <div key={activity.id + "progress"}>
            <Progress 
            percent={getPercentStatus(String(activity.status))} 
            indicating={getPercentStatus(String(activity.status)) !== 0} 
            progress
            className='myActivity_progress'
            key={activity.id + "myActivity_progress"}
            >
             {getPercentText(String(activity.status))}
            </Progress>
          </div>       
             </Item.Description>
         </Item.Content>
         <Item.Content key={activity.id + "buttonItem"} className={isMobile ? "order_listItem_extraContent_mobile":"order_listItem_extraContent"} >
         <Item.Description key={activity.id + "buttondesc"} style={{flex:"end"}}>
         <Button
                 onClick={()=> history.push(`/activities/${activity.id}`)}
                 key={activity.id + "button"}
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