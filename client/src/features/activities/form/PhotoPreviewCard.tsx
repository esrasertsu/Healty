import React, { useContext, useEffect, useState } from 'react'
import {
    Avatar,
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    CardMedia,
    CardActions,
    IconButton,
    CardActionArea,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    DialogTitle,
    DialogContent,
    DialogActions
  
  } from '@material-ui/core';
  import { ZoomIn, DeleteOutlined,Close,SaveAlt,WallpaperOutlined } from '@material-ui/icons';
import { observer } from 'mobx-react';
import { styled } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import { Button, Popup } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IPhoto } from '../../../app/models/profile';
interface IProps{
      photo:IPhoto;
      deleteActivityPhoto: (photo:IPhoto) => void;
      makeCoverPic : (photo:IPhoto) => void;
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
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const PhotoPreviewCard:React.FC<IProps> = ({photo,deleteActivityPhoto,makeCoverPic,newMainId}) => {
    const rootStore = useContext(RootStoreContext);
    const {deleteDocument,isCurrentUser} = rootStore.profileStore;


const [openIframe, setopenIframe] = useState(false);
const [openDelete, setOpenDelete] = useState(false);

    const handleShowDoc =(url:string) => {
      const link = window.document.createElement("a");
      link.download = "blabal.pdf";
      link.href =url;
      link.click();
    }

    const handleShowDocInIframe=() => {
        setopenIframe(true);
    }
    const handleClose = () => {
        setopenIframe(false);
      };

      const handleCloseDelete = () => {
        setOpenDelete(false);
      };
      const handleOpenDelete = () => {
        setOpenDelete(true);
      };

      const deleteDoc = () => {
          debugger;
          deleteActivityPhoto(photo);
       // deleteDocument(photo.id); //yeni endpoint yazılsın admin için, trainer adı da gönderilsin
        handleCloseDelete();
      };

      const handleMakeCover = () =>{
        if(!photo.isMain)
          makeCoverPic(photo)
      }

    return (
        <>
        <Dialog 
    //   sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={openDelete}
    >
      <DialogTitle>Belge Silme</DialogTitle>
      <DialogContent>
        Bu belgeyi silmek istediğine emin misin?
      </DialogContent>
      <DialogActions>
        <Button secondary autoFocus onClick={handleCloseDelete}>
          İptal
        </Button>
        <Button primary onClick={deleteDoc}>Sil</Button>
      </DialogActions>
    </Dialog>
        <Dialog
        fullScreen
        open={openIframe}
        onClose={handleClose}
        // TransitionComponent={Transition}
        >
         <AppBar
        //   sx={{ position: 'relative' }}
          >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography 
            // sx={{ ml: 2, flex: 1 }} 
            variant="h6" component="div">
              {photo.id}
            </Typography>
            <Button download href={photo.url}>
                Dosyayı indir
            </Button>
          </Toolbar>
        </AppBar>
         <iframe allowFullScreen height="100%"  src={photo.url} />
        </Dialog>
        <Grid key={photo.id+"grid"} xs={12} sm={6} md={3} item>
                    <Card key={photo.id + "_card"} 
                    // sx={{ px: 1 }}
                    >
                    <CardActionArea key={photo.id + "_cardActionArea"}  
                   // onClick={() =>handleShowDocInIframe()}
                     href = {photo.url} target = "_blank"
                    >
                    <CardMedia key={photo.id + "_cardMedia"}
                        component="img"
                        height="140"
                        image={photo.url}
                        onError={(e:any) => {
                          debugger
                          /** 
                           * Any code. For instance, changing the `src` prop with a fallback url.
                           * In our code, I've added `e.target.className = fallback_className` for instance.
                           */
                          e.target.src = "/assets/empty-image.png";
                        }}
                    />
                    </CardActionArea>

                    <CardActions disableSpacing key={photo.url + "_cardActions"}>
                    {/* <IconButton onClick={handleShowDocInIframe} aria-label="Görüntüle" key={photo.url + "_openBtn"} size="small" >
                    <ZoomIn />
                    </IconButton> */}
                    <IconButton target="_blank" aria-label="İndir" key={photo.url + "_saveBtn"} size="small"  href={photo.url} download>
                    <SaveAlt />
                    </IconButton>
                    { !photo.isMain  &&

                      <Popup
                      hoverable
                      position="top center"
                      on={['hover', 'click']}
                      positionFixed 
                      content={"Görseli sil"}
                      key={photo.url+"_subPopover_del"}
                      trigger={ 
                        <IconButton aria-label="Sil" key={photo.url + "_delBtn"} size="small"  onClick={handleOpenDelete}>
                             <DeleteOutlined color={"secondary"}/>
                         </IconButton>
                      }
                      />
                     
                    }
                    {
                        photo.id !== "" &&

                        <Popup
                          hoverable
                          position="top center"
                          on={['hover', 'click']}
                          positionFixed 
                          content={photo.isMain ? "Mevcut kapak görseli" : "Kapak görseli yap"}
                          key={photo.url+"_subPopover_cover"}
                          trigger={ 
                            <IconButton aria-label="CoverPic" key={photo.url + "_coverBtn"} size="small"  onClick={handleMakeCover}>
                              <WallpaperOutlined style={photo.isMain? {color:"blue"} :newMainId === photo.id ? {color:"green"} : {color:"inherit"}} />
                          </IconButton>
                          }
                        />

                    }
                    
                </CardActions>
                    </Card>
                </Grid>
    </>
    )
}

export default observer(PhotoPreviewCard);

