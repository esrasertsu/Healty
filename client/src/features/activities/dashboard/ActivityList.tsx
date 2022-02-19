import React, { Fragment, useContext } from 'react'
import { Header, Icon, Image, Item, Label, Message } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityListItem  from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'

const ActivityList: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;
  const list = [
    'Hata olduğunu düşünüyorsanız site yöneticisiyle iletişime geçebilir,',
    'Talepte bulunmak için bize mail atabilir,',
    'Ya da bir eğitmen olarak kriterlere uygun bir aktivite açabilirsiniz :)'
  ]
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  return (
    <Fragment>
      {activitiesByDate.length > 0 ?
      activitiesByDate.map(([group, activities]) =>(
        <Fragment key={group}>
           <h3 className={"activityDateLabels "} >
             <Icon size='large' name="calendar alternate outline" /> {format(new Date(group), 'dd MMMM yyyy, eeee',{locale: tr})}
           </h3>
        <Item.Group divided>
          {activities.map((activity) => (
           <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Item.Group>
     </Fragment>
      )) :
      <>
      {!isTabletOrMobile && <br></br> }
      <div style={isMobile? {textAlign:"center", marginBottom:"40px" } : {display:"flex", justifyContent:"center" , marginTop:"40px"}}>
        <div>
        <Header size="large" style={{color:"#222E50"}} content="Merhaba!"/>
        <Header size="medium" style={{color:"#222E50"}} content="Şimdilik arama kriterlerine uygun açılmış bir aktivite bulamadık ama senin için oluşturmaya devam ediyoruz. Takipte kal"/>
          </div>
       <Image src={"/icons/clip-searching.png"} style={isMobile? {width:"100%", marginTop:"75px"} : {width:"50%", marginTop:"75px"}} />
      </div>
     </>
    }
    </Fragment>
    
  );
};

export default observer(ActivityList)