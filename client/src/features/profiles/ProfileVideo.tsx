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
    const {user} = rootStore.userStore;
    const { isCurrentUser,uploadProfileVideo, submittingVideo, profile } = rootStore.profileStore;


    const handleDelete = () => {
             uploadProfileVideo("", profile!.userName);
            };

         
    return (
        
            (videoUrl!=="" && videoUrl !== null) ?
        <Segment className="profileMessageSegment">
                <Grid container className="profileMessageGrid" stackable>
                    <Grid.Column width={16}>
                                <>
                                <ReactPlayer
                                config={{ playerVars:{controls:1}}}
                                width="auto" 
                                height="256px" 
                                controls={true}
                                url={videoUrl} />
                                {(isCurrentUser || (user && user.role==="Admin")) && (
                                <Button.Group fluid widths={2}>
                                    <Button
                                    name="upload"
                                    onClick={()=>openModal("Video Yükleme",<ProfileVideoUploadForm url={profile!.videoUrl} closeModal={closeModal} />,false,null,undefined,true)}
                                    disabled={submittingVideo}
                                    loading={submittingVideo}
                                    basic
                                    positive
                                    circular
                                    content="Değiştir"
                                    />
                                    <Button
                                    name="silVideo"
                                    disabled={submittingVideo}
                                    loading={submittingVideo}
                                    onClick={handleDelete}
                                    basic
                                    circular
                                    negative
                                    icon="trash"
                                    />
                                </Button.Group>
                                )
                              }
                              </>
                           
                            
                        </Grid.Column>
                </Grid>
       </Segment>
       : 
      (isCurrentUser || (user && user.role ==="Admin")) ?
        <> <Button circular color='red' content={<span>Video Ekle <Icon name='youtube'></Icon></span>}  size='mini'
                            onClick={()=>
                                openModal("Video Yükleme",
                                <ProfileVideoUploadForm  url="" closeModal={closeModal} />,false,null, undefined, true)}
                            ></Button>
                            <div className='notFoundText'><Icon name="meh outline" />Henüz bu uzmana ait bir tanıtım videosu bulunmamaktadır.</div>
          </>:
            <div className='notFoundText'><Icon name="meh outline" />Henüz bu uzmana ait bir tanıtım videosu bulunmamaktadır.</div>
         
         

    )
}

export default observer(ProfileVideo);
