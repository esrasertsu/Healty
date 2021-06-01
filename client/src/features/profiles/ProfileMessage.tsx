import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Grid, Header, Icon, Image, Item, Label, Segment } from 'semantic-ui-react'
import { IProfile } from '../../app/models/profile'
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileMessageForm from './ProfileMessageForm'

interface IProps {
    profile: IProfile
}

const ProfileMessage: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);

    return (
        <Segment className="profileMessageSegment">
                <Grid container className="profileMessageGrid" stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={5}>
                            <Image circular size={'tiny'} src={profile.image || '/assets/user.png'}></Image>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Header>{profile.displayName}</Header>
                            <Label>Cevap verme %60&nbsp;
                                {/* <Icon size="large" name="question circle" className="questionmarkicon"></Icon> */}
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16} className="MessageForm">
                            <ProfileMessageForm></ProfileMessageForm>
                            <Button
                            className="showNumberButton"
                            content='Telefonunu Göster'
                            labelPosition='right'
                            icon="cell phone"
                        />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
       </Segment>
    )
}

export default observer(ProfileMessage);
