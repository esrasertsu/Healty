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
             <Segment attached='top'>
               <Grid>
                 <Grid.Column width={1}>
                   <Icon size='large' color='teal' name='info' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                {
                  !showMore ?
                  <>
                  <div key={activity.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(activity.description.slice(0, 2000))}} />
                  {activity.description.length > 2000 && <div className="readMore" onClick={() => setShowMore(true)}>Read more</div>} 
                  </> :
                <div key={activity.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(activity.description)}} />

                }
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='calendar' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                   <span>
                     {activity.date && format(activity.date, 'eeee do MMMM')} at  {activity.date && format(activity.date, 'h:mm a')}
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
                   <span>{activity.venue}, {activity.city && activity.city.text}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
           </Segment.Group>
    )
}

export default observer(ActivityDetailedInfo)