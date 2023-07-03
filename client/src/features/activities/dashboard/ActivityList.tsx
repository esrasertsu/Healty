import React, { Fragment, useContext } from 'react'
import { Grid, Header, Icon, Image, Item, Label, Message } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityListItem  from './ActivityListItem';
import { useStore } from '../../../app/stores/rootStore';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'

const ActivityList: React.FC = () => {

  const rootStore = useStore();
  const { activitiesByDate } = rootStore.activityStore;
  const list = [
    'Hata olduğunu düşünüyorsanız site yöneticisiyle iletişime geçebilir,',
    'Talepte bulunmak için bize mail atabilir,',
    'Ya da bir eğitmen olarak kriterlere uygun bir aktivite açabilirsiniz :)'
  ]
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  return (
    <Fragment>
      {activitiesByDate.length > 0 ?
      activitiesByDate.map(([group, activities]) =>(
        <Fragment key={group}>
          <Grid stackable>
            <Grid.Row style={{marginTop:"30px"}}>
            <Grid.Column width={2}>
          <h3 className={"activityDateLabels "} >
             {/* <Icon size='large' name="calendar alternate outline" /> */}
             {isTabletOrMobile ? format(new Date(group), 'd MMMM, eeee',{locale: tr}) :
            <>
            <div style={{fontSize:"1.7rem"}}>{format(new Date(group), 'd',{locale: tr})}</div> 
             <div style={{fontSize:"14px"}}>{format(new Date(group), 'MMMM',{locale: tr})}</div>
             </>
             }
           </h3>
            </Grid.Column>
            <Grid.Column width={14}>
            <Item.Group divided>
              {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
            </Grid.Column>
          </Grid.Row>
        
          </Grid>
         
        
     </Fragment>
      )) :
      <>
      {!isTabletOrMobile && <br></br> }
      <div style={isMobile? {textAlign:"center", marginBottom:"40px" } : {display:"flex", justifyContent:"center" , marginTop:"40px"}}>
        <div>
        <Header size="large" style={{color:"#222E50"}} content="Welcome!"/>
        <Header size="medium" style={{color:"#222E50"}} content="We'll meet you here with new activities soon. Please follow us on Instagram."/>
          </div>
       {/* <Image src={"/icons/clip-searching.png"} style={isMobile? {width:"100%", marginTop:"75px"} : {width:"50%", marginTop:"75px"}} /> */}
      </div>
     </>
    }
    </Fragment>
    
  );
};

export default observer(ActivityList)