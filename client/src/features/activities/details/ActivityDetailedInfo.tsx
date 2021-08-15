import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import dompurify from 'dompurify';
import tr  from 'date-fns/locale/tr'

const ActivityDetailedInfo:React.FC<{activity:IActivity}> = ({activity}) => {

  const sanitizer = dompurify.sanitize;
  const [showMore, setShowMore] = useState(false);

    return (
       <Segment.Group>
          <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='bookmark' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                   
                    <span className="activityDetailLabel">Kategori </span> 
                    <div className="homepage_subheader">

                   <p>
                   {
                     activity.categories && activity.categories.length> 0 ?
                     activity.categories.map<React.ReactNode>(s => <span key={activity.id + "_cat_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                   </p>
                   </div>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='tags' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                 <span className="activityDetailLabel">Branş </span> 
                 <div className="homepage_subheader">
                <p>
                   {
                     activity.subCategories && activity.subCategories.length> 0 ?
                     activity.subCategories.map<React.ReactNode>(s => <span key={activity.id + "_subcat_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                   </p>
                   </div>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid>
                 <Grid.Column width={1}>
                   <Icon size='large' color='teal' name='info' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                {
                  !showMore ?
                  <>
                 <span className="activityDetailLabel">Açıklama </span> 
                  <div key={activity.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(activity.description.slice(0, 2000))}} />
                  {activity.description.length > 2000 && <div className="readMore" onClick={() => setShowMore(true)}>Read more</div>} 
                  </> :
                  <>
                 <span className="activityDetailLabel">Açıklama </span> 
                <div key={activity.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(activity.description)}} />
                </>
                }
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='heartbeat' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Seviye </span> 

                   {
                     activity.levels && activity.levels.length> 0 ?
                     activity.levels.map<React.ReactNode>(s => <span key={activity.id + "_level_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='calendar alternate outline' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={7}>
                 <span className="activityDetailLabel">Tarih </span> 
                   <span>
                     { activity.date &&  format(activity.date, 'dd MMMM, eeee',{locale: tr})} 
                   </span>
                 </Grid.Column>
                 <Grid.Column width={1}>
                   <Icon name='clock outline' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={7}>
                 <span className="activityDetailLabel">Saat </span> 
                   <span>
                   { activity.date && format(activity.date, 'H:mm',{locale: tr})}
                   </span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='map outline' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Şehir </span> 

                   <span>{activity.city ? activity.city.text : "Belirtilmemiş"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='map pin' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Lokasyon </span> 
                   <span>{activity.venue ? activity.venue : "Belirtilmemiş"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='wifi' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                  {activity.online ?  <span> Online katılıma açık <Icon name='check' size='small' color='green' /> </span>: <span>Online katılıma kapalı</span>}
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='users' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Katılımcı sınırı </span> 
                   <span>{activity.attendancyLimit===0 || activity.attendancyLimit === null? "Sınırsız katılımcı" : activity.attendancyLimit +" kişi"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='money' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Fiyat </span> 
                   <span>{activity.price===0 ? "Ücretsiz" : activity.price +" TL"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
           </Segment.Group>
    )
}

export default observer(ActivityDetailedInfo)