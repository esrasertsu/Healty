import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import dompurify from 'dompurify';

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
                 <Grid.Column width={11}>
                   {
                      "Kategori: "
                   }
                   {
                     activity.subCategories && activity.subCategories.length> 0 ?
                     activity.subCategories.map<React.ReactNode>(s => <span>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
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
                  <span>Açıklama:</span>
                  <div key={activity.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(activity.description.slice(0, 2000))}} />
                  {activity.description.length > 2000 && <div className="readMore" onClick={() => setShowMore(true)}>Read more</div>} 
                  </> :
                  <>
                <span>Açıklama:</span>
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
                   {
                      "Seviye: "
                   }
                   {
                     activity.levels && activity.levels.length> 0 ?
                     activity.levels.map<React.ReactNode>(s => <span>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='calendar' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={7}>
                   <span>
                     { activity.date && "Tarih: "+ format(activity.date, 'eeee do MMMM')} 
                   </span>
                 </Grid.Column>
                 <Grid.Column width={1}>
                   <Icon name='time' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={7}>
                   <span>
                   { activity.date && " Saat: " +format(activity.date, 'h:mm a')}
                   </span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='marker' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                   <span>{"Lokasyon: " + activity.venue} {activity.city && ", Şehir: " + activity.city.text}</span>
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
                   <span>{activity.attendancyLimit===0 || activity.attendancyLimit === null? "Sınırsız katılımcı" : "Katılımcı sınırı: " +activity.attendancyLimit +" kişi"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='money' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                   <span>{activity.price===0 ? "Ücretsiz" : "Ücret: " +activity.price +" TL"}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
           </Segment.Group>
    )
}

export default observer(ActivityDetailedInfo)