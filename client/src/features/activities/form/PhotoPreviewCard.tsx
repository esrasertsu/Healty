import React, { useState } from 'react'
import { observer } from 'mobx-react';
import { Button, Card, CardContent, Confirm, Grid, Icon, Image, Popup } from 'semantic-ui-react';
import { IPhoto } from '../../../app/models/profile';
interface IProps{
      photo:IPhoto;
      deleteActivityPhoto: (photo:IPhoto) => void;
      makeCoverPic? : (photo:IPhoto) => void;
      newMainId:string;
  }

//   const AvatarWrapper = styled(Avatar)(
//     ({ theme }) => `
//           background: transparent;
//           margin-left: -${theme.spacing(0.5)};
//           margin-bottom: ${theme.spacing(1)};
//           margin-top: ${theme.spacing(2)};
//   `
//   );
// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & {
//       children: React.ReactElement;
//     },
//     ref: React.Ref<unknown>,
//   ) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

const PhotoPreviewCard:React.FC<IProps> = ({photo,deleteActivityPhoto,makeCoverPic,newMainId}) => {

const [openDelete, setOpenDelete] = useState(false);

 

      const handleCloseDelete = () => {
        setOpenDelete(false);
      };
      const handleOpenDelete = () => {
        setOpenDelete(true);
      };

      const deleteDoc = () => {
          deleteActivityPhoto(photo);
        handleCloseDelete();
      };

      const handleMakeCover = () =>{
        if(!photo.isMain)
          makeCoverPic && makeCoverPic(photo)
      }

    return (
        <>

<Confirm
          content='Bunu silmek istediğine emin misin?'
          open={openDelete}
          header="Sil"
          cancelButton='İptal'
          confirmButton="Sil"
          onCancel={handleCloseDelete}
          onConfirm={deleteDoc}
        />

        <Grid.Column key={photo.id+"grid"}>
                    <Card className='photoPreview' key={photo.id + "_card"}>
                      <Image 
                      key={photo.id + "_cardMedia"}
                     src={photo.url} 
                     wrapped 
                     ui={false} 
                     target = "_blank"
                     onError={(e:any) => {
                          e.target.src = "/assets/empty-image.png";
                        }} />
                   
                    <CardContent key={photo.url + "_cardActions"}>
                    <Button basic type="button" key={photo.url + "_saveBtn"} animated='vertical' target="_blank" aria-label="İndir" href={photo.url} download >
                      <Button.Content hidden>İndir</Button.Content>
                      <Button.Content visible>
                        <Icon name="download" />
                      </Button.Content>
                    </Button>
                 
                    { !photo.isMain  &&
                      <Button basic color="red" type="button" key={photo.url + "_delBtn"} animated='vertical' onClick={handleOpenDelete} >
                      <Button.Content hidden>Sil</Button.Content>
                      <Button.Content visible>
                        <Icon name="trash alternate outline" />
                      </Button.Content>
                    </Button>


                    }
                    {
                        <Popup
                        hoverable
                        position="top center"
                        on={['hover', 'click']}
                        positionFixed 
                        content={photo.isMain ? "Mevcut kapak görseli" : "Kapak görseli yap"}
                        key={photo.url+"_subPopover_cover"}
                        trigger={ 
                        photo.id !== "" && makeCoverPic &&
                        <Button basic  color={photo.isMain? "blue" :"green" } type="button"  key={photo.url + "_coverBtn"} animated='vertical' onClick={handleMakeCover}
                        disabled={photo.isMain} >
                        <Button.Content hidden>Kapak</Button.Content>
                        <Button.Content visible>
                          <Icon color={photo.isMain? "blue" :"green" } name="image outline" />
                        </Button.Content>
                      </Button>
                        } />

                    }
                    
                </CardContent>
                    </Card>
        </Grid.Column>
    </>
    )
}

export default observer(PhotoPreviewCard);

