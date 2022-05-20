import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Segment, Grid, Icon, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import dompurify from 'dompurify';
import tr  from 'date-fns/locale/tr'
import { useMediaQuery } from 'react-responsive'
import { BiWifi, BiWifiOff } from 'react-icons/bi'

const ActivityDetailedInfo:React.FC<{activity:IActivity}> = ({activity}) => {

  const sanitizer = dompurify.sanitize;
  const [showMore, setShowMore] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const [durationDay, setDurationDay] = useState(Math.floor(activity.duration / (24*60)))
  const [durationHour, setDurationHour] = useState(Math.floor((activity.duration % (60*24) )/ 60))
  const [durationMin, setDurationMin] = useState(Math.floor((activity.duration % (60*24)) % 60))


    return (
      <>
    {
     !showMore ?
      <>
                  <div className='activity-description' key={activity.id+"_desc"} dangerouslySetInnerHTML={{__html:sanitizer(activity.description.slice(0, 2000))}} />
                  {activity.description.length > 2000 && <div className="readMore" onClick={() => setShowMore(true)}>Read more</div>} 
                  </> :
                <div className='activity-description' key={activity.id+"_desc"} dangerouslySetInnerHTML={{__html:sanitizer(activity.description)}} />
                }
      <h2>Aktivite Detayları</h2>
       {/* <Segment.Group className="activityDetails_GridSegment"> */}
       <div>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 : 1}>
                   <Icon name='bookmark' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 14 :15}>
                   
                    <span className="activityDetailLabel">Kategori: </span> 
                   {
                     activity.categories && activity.categories.length> 0 ?
                     activity.categories.map<React.ReactNode>(s => <span key={activity.id + "_cat_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='tags' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 14 :15}>
                 <span className="activityDetailLabel">Branş: </span> 
                   {
                     activity.subCategories && activity.subCategories.length> 0 ?
                     activity.subCategories.map<React.ReactNode>(s => <span key={activity.id + "_subcat_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='heartbeat' size='large' style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Seviye: </span> 
               
                   {
                     activity.levels && activity.levels.length> 0 ?
                     activity.levels.map<React.ReactNode>(s => <span key={activity.id + "_level_"+s.key}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
                     : "Bilgi yok"
                   }
                 
                 </Grid.Column>
               </Grid>
             
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='calendar alternate outline' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 6 :7}>
                 <span className="activityDetailLabel">Başlangıç Tarihi: </span> 
                   <span>
                     { activity.date &&  format(activity.date, 'dd MMMM yyyy, eeee',{locale: tr})} 
                   </span>
                 </Grid.Column>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='clock outline' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 6 :7}>
                 <span className="activityDetailLabel">Başlangıç Saati: </span> 
                   <span>
                   { activity.date && format(activity.date, 'H:mm',{locale: tr})}
                   </span>
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='calendar alternate outline' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 6 :7}>
                 <span className="activityDetailLabel">Bitiş Tarihi: </span> 
                   <span>
                     { activity.endDate &&  format(activity.endDate, 'dd MMMM yyyy, eeee',{locale: tr})} 
                   </span>
                 </Grid.Column>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='clock outline' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={isMobile? 6 :7}>
                 <span className="activityDetailLabel">Bitiş Saati: </span> 
                   <span>
                   { activity.endDate && format(activity.endDate, 'H:mm',{locale: tr})}
                   </span>
                 </Grid.Column>
               </Grid>
           
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name="time" size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Süre: </span> 

                   <span>{durationDay > 0 && (durationDay + " gün ")}</span>
                   <span>{durationHour > 0 && (durationHour +" saat ")}</span>
                   <span>{durationMin >0 && (durationMin + " dakika")}</span>
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='map outline' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Şehir: </span> 

                   <span>{activity.city ? activity.city.text : "Belirtilmemiş"}</span>
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='map pin' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Lokasyon: </span> 
                   <span>{activity.venue !== "null" && activity.venue !=="" ? activity.venue : "Belirtilmemiş"}</span>
                 </Grid.Column>
               </Grid>
             
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                 {activity.online ? <BiWifi style={{fontSize: "26px"}}/> :<BiWifiOff style={{fontSize: "26px"}}/> }
                 </Grid.Column>
                 <Grid.Column width={11}>
                  {activity.online ?  
                  <span> Online katılıma açık  </span>: <span>Online katılıma kapalı</span>}
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='users' size='large'  style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Katılımcı sınırı: </span> 
                   <span>{activity.attendancyLimit===0 || activity.attendancyLimit === null? "Sınırsız katılımcı" : activity.attendancyLimit +" kişi"}</span>
                 </Grid.Column>
               </Grid>
            
               <Grid verticalAlign='middle'>
                 <Grid.Column width={isMobile? 2 :1}>
                   <Icon name='money' size='large' style={{color:"#222E50"}} />
                 </Grid.Column>
                 <Grid.Column width={11}>
                 <span className="activityDetailLabel">Fiyat: </span> 
                   <span>{activity.price===0 ? "Ücretsiz" : activity.price +" TL"}</span>
                 </Grid.Column>
               </Grid>
           </div>
           
           </>
    )
}

export default observer(ActivityDetailedInfo)