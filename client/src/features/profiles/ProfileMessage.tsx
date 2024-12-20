import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Grid, Header, Image, Label, Segment } from 'semantic-ui-react'
import { IProfile } from '../../app/models/profile'
import ProfileMessageForm from './ProfileMessageForm'

interface IProps {
    profile: IProfile
}

const ProfileMessage: React.FC<IProps> = ({profile}) => {

    return (
        <Segment className="profileMessageSegment">
                <Grid container className="profileMessageGrid" stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={5}>
                            <div className='profileImage'>
                            <Image circular src={profile.image || '/assets/user.png'}
                            onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}></Image>
                            </div>
                            
                        </Grid.Column>
                        <Grid.Column width={11} className="infoArea">
                            <Header className='trainerName'>{profile.displayName}</Header>
                            <Label className='gray_label' size="large">Yanıtlama oranı %{profile.responseRate}&nbsp;
                                {/* <Icon size="large" name="question circle" className="questionmarkicon"></Icon> */}
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16} className="MessageForm">
                            <ProfileMessageForm></ProfileMessageForm>
                            {/* <Button
                            className="showNumberButton"
                            content='Telefonunu Göster'
                            labelPosition='right'
                            icon="phone"
                        /> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
       </Segment>
    )
}

export default observer(ProfileMessage);
