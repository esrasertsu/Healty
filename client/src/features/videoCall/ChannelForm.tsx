import React, { Fragment, useContext, useEffect, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Button, Container, Grid } from 'semantic-ui-react';

const ChannelForm = (props: {
    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    setChannelName: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { setInCall, setChannelName } = props;
  
    return (
        <Container>
        <Grid stackable>
            <Grid.Row columns="2">
                <Grid.Column>
              <h1>
                  Hazır mısın?
              </h1>
              <p>
                Aktivite odanıza lütfen spesifik bir isim giriniz. Bu isim bağlantının kurulması için gereklidir.
              </p>
                </Grid.Column>
                <Grid.Column>
                <form className="join">
                    {process.env.REACT_APP_AGORA_APP_ID === '' && <p style={{color: 'red'}}>Bu bir Agora App ID problemidir, lütfen en yakın zamanda bize bildirin.</p>}
                    <input type="text"
                    placeholder="Best Activity Ever"
                    onChange={(e) => setChannelName(e.target.value)}
                    />
                    <button onClick={(e) => {
                    e.preventDefault();
                    //burası methoda dönüşecek. Methodda oda ismi aktiviteye yazılacak. 
                    //Normal kullanıcılar bu sayfayı görmeyip, oda ismi yoksa uyarı mesajı gösterilecek.
                    //Hoca ise bu sayfa gösterilecek. Oda ismi varsa direkt odaya bağlanıcak o da.
                    setInCall(true);
                    }}>
                    Başlat
                    </button>
                </form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </Container>
      
    );
  };

  export default observer(ChannelForm)