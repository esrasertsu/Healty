import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Button, Grid, Icon, Segment } from 'semantic-ui-react'
import ReactPlayer from 'react-player/youtube'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileVideoUploadForm from './ProfileVideoUploadForm'
import * as _screenfull from "screenfull";

interface IProps {
    videoUrl?: string
}

const ProfileVideo: React.FC<IProps> = ({videoUrl}) => {

    const rootStore = useContext(RootStoreContext);
    const {openModal, closeModal} = rootStore.modalStore;
    const { isCurrentUser,uploadProfileVideo, submittingVideo, profile } = rootStore.profileStore;


    const handleDelete = () => {
        debugger;
             uploadProfileVideo("");
            };

         
    return (
        <Segment className="profileMessageSegment">
                <Grid container className="profileMessageGrid" stackable>
                    
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {
                                (videoUrl!=="" && videoUrl !== null) ?
                                <>
                                <ReactPlayer
                                config={{ playerVars:{controls:1}}}
                                width="auto" 
                                height="256px" 
                                controls={true}
                                url={videoUrl} />
                                {isCurrentUser && (
                                <Button.Group fluid widths={2}>
                                    <Button
                                    name="upload"
                                    onClick={()=>openModal("Video Yükleme",<ProfileVideoUploadForm url={profile!.videoUrl} closeModal={closeModal} />,false,null)}
                                    disabled={submittingVideo}
                                    loading={submittingVideo}
                                    basic
                                    positive
                                    content="Değiştir"
                                    />
                                    <Button
                                    name="silVideo"
                                    disabled={submittingVideo}
                                    loading={submittingVideo}
                                    onClick={handleDelete}
                                    basic
                                    negative
                                    icon="trash"
                                    />
                                </Button.Group>
                                )
                              }
                              </>
                            :
                            isCurrentUser ? <Button icon="plus" content="Video Ekle" 
                            onClick={()=>openModal("Video Yükleme",<ProfileVideoUploadForm  url="" closeModal={closeModal} />,false,null)}
                            ></Button>
                            : 
                            <span><Icon name="meh outline" />Henüz bu uzmana ait bir tanıtım videosu bulunmamaktadır.</span>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
       </Segment>
    )
}

export default observer(ProfileVideo);
