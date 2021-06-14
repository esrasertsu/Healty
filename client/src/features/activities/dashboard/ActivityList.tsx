import React, { Fragment, useContext } from 'react'
import { Item, Label, Message } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { ActivityListItem } from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const ActivityList: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;
  const list = [
    'Hata olduğunu düşünüyorsanız site yöneticisiyle iletişime geçebilir,',
    'Talepte bulunmak için bize mail atabilir,',
    'Ya da bir eğitmen olarak kriterlere uygun bir aktivite açabilirsiniz :)'
  ]

  return (
    <Fragment>
      {activitiesByDate.length > 0 ?
      activitiesByDate.map(([group, activities]) =>(
        <Fragment key={group}>
           <Label size='large' style={{backgroundColor: "#263a5e", color:"#fff"}}>
              {format(new Date(group), 'eeee do MMMM')}
           </Label>
        <Item.Group divided>
          {activities.map((activity) => (
           <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Item.Group>
     </Fragment>
      )) :
      <>
      <br></br>
       <Message style={{marginTop:"30px"}} header='Aradığınız kriterlere uygun bir aktivite bulunamadı :(' list={list} />
     </>
    }
    </Fragment>
    
  );
};

export default observer(ActivityList)