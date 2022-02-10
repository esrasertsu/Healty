import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button, Card, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { RootStoreContext } from '../../app/stores/rootStore';
import tr  from 'date-fns/locale/tr'
import { history } from '../..';


const threeItem:SemanticWIDTHS = 3;
const twoItems:SemanticWIDTHS = 2;

const SavedActivities = () => {

    
    const rootStore = useContext(RootStoreContext);
    const { getSavedActivities, savedActivities, loading } = rootStore.activityStore;

    const { user } = rootStore.userStore;

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    useEffect(() => {
        getSavedActivities();
    }, []);
    

  return (
    <Tab.Pane attached={false} loading={loading}>
        {
        savedActivities.map((act) => (
            <Segment key={"savedActivity_segment_"+ act.id}>
        <Grid stackable>
                    <Grid.Column width={3}>
                    <Image key={"savedActivity_img_" + act.id}
                    style={{width:"100%", objectFit:"cover"}} 
                    size="small" 
                    className='savedActivity_img'
                    src={act.mainImage ? act.mainImage.url : '/assets/placeholder.png'} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <div>
                       <Header> {act.title}</Header>  
                       <div>
                          Tarih/Saat: {format(new Date(act.date), 'dd MMMM yyyy, HH:mm',{locale: tr})}
                        </div>
                        {
                            act.online ? <div> Online Aktivite</div> : <div>{act.city? act.city.text: "Şehir Belirtilmemiş" +" , "+ act.venue}</div>
                        }
                         {
                            act.price ? <div> Fiyat : {Number(act.price)}TL</div> : <div>Ücretsiz Aktivite</div>
                        }
                    </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <div className='savedActivity_lastcolumn'>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <Image
                            key={"savedActivity_trainer_img_" + act.id}
                            circular 
                            size="mini"
                            className='savedActivity_trainer_img'
                            src={act.attendees.filter(x => x.isHost === true)[0].image || '/assets/user.png'} />
                            <div style={{marginLeft:"7px"}}> <span>Düzenleyen</span><br></br>
                                {act.attendees.filter(x => x.isHost === true)[0].displayName}
                                </div>
                        </div>
                        <Button size='tiny' circular content="Katıl" className='orange-gradientBtn' fluid={isTablet}
                        style={isTablet? {marginTop:"15px"}: {}}
                          onClick={()=> history.push(`/activities/${act.id}`)} />
                        </div>
                    </Grid.Column>
                </Grid>
            </Segment>
         
        
            ))
        }
        </Tab.Pane>
  );
};


export default observer(SavedActivities)