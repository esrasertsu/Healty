import React, { useContext } from 'react';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';


const ActivitySuccessPage:React.FC = () =>{
    const rootStore = useContext(RootStoreContext);
    const history = useHistory();
    const {user} = rootStore.userStore;

   
    return(
        <Container className="pageContainer">

        <Segment placeholder style={{height:"90vh"}}>
            <Header icon size="huge">
                <Icon name="checked calendar" />
            </Header>

            <Segment.Inline>
                <div className="center">
                    <Header as={"h2"} textAlign="center" style={{marginBottom:"30px"}}>Aktivite talebiniz başarıyla oluşturuldu!</Header>
                    <p style={{textAlign:"center"}}>Bundan sonrası biz de <Icon name="smile outline"></Icon></p>
                    
                    <p>Aktiviteniz onaylandığı anda satışa açılacak ve listelerde görünmeye başlayacaktır. Onay sürecini <a>Aktivitelerim</a> sekmesi altından kontrol edebilirsiniz.</p>
                   <div style={{display:"flex", justifyContent:"center", flexDirection:"row",marginTop:"50px" }}>
                    <Button onClick={() => history.push(`/profile/${user!.userName}`)} content="Profilime git" circular className="blueBtn"/>
                    <Button onClick={() => history.push(`/createActivity`)} content="Yeni Aktivite Aç" circular className='orangeBtn'/>
                   </div>
                </div>
            </Segment.Inline>
        </Segment>
        </Container>
    )
};

export default observer(ActivitySuccessPage);