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
  import { ZoomIn, DeleteOutlined,Close,SaveAlt } from '@material-ui/icons';

import { observer } from 'mobx-react';
import { styled } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IDocument } from '../../app/models/profile';
import { Button } from 'semantic-ui-react';
interface IProps{
      document:IDocument;
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

const DocumentPreviewCard:React.FC<IProps> = ({document}) => {
    const rootStore = useContext(RootStoreContext);
    const {deleteDocument,isCurrentUser} = rootStore.profileStore;


const [openIframe, setopenIframe] = useState(false);
const [openDelete, setOpenDelete] = useState(false);

    const handleShowDoc =() => {
        window.open(document.url);
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
        deleteDocument(document.id); //yeni endpoint yazılsın admin için, trainer adı da gönderilsin
        handleCloseDelete();
      };

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
              {document.name}
            </Typography>
            <Button download href={document.url}>
                Dosyayı indir
            </Button>
          </Toolbar>
        </AppBar>
         <iframe allowFullScreen height="100%"  src={document.url} />
        </Dialog>
        <Grid key={document.id+"grid"} xs={12} sm={6} md={3} item>
                    <Card key={document.id + "_card"} 
                    // sx={{ px: 1 }}
                    >
                    <CardActionArea key={document.id + "_cardActionArea"}  onClick={handleShowDoc}
                    // href = {Pdf} target = "_blank"
                    >
                    <CardMedia key={document.id + "_cardMedia"}
                        component="img"
                        alt={document.name}
                        height="140"
                        image={document.url}
                    />
                    {/* <CardContent key={document.id + "_cardContent"}>
                        <Typography variant="h5" noWrap>
                        {document.id}
                        </Typography>
                        <Typography variant="subtitle1" noWrap>
                        {document.name}
                        </Typography>
                        <Box sx={{ pt: 3 }}>
                        {/* <Typography variant="h3" gutterBottom noWrap>
                        {document.resourceType}
                        </Typography> 
                        <Typography variant="subtitle2" noWrap>
                        {document.url}
                        </Typography>
                        </Box>
                    </CardContent> */}
                    </CardActionArea>

                    <CardActions disableSpacing key={document.url + "_cardActions"}>
                    {/* <IconButton onClick={handleShowDocInIframe} aria-label="Görüntüle" key={document.url + "_openBtn"} size="small" >
                    <ZoomIn />
                    </IconButton> */}
                    <IconButton target="_blank" aria-label="İndir" key={document.url + "_saveBtn"} size="small"  href={document.url} download>
                    <SaveAlt />
                    </IconButton>
                   { <IconButton aria-label="Sil" key={document.url + "_delBtn"} size="small"  onClick={handleOpenDelete}>
                    <DeleteOutlined />
                    </IconButton>}
                </CardActions>
                    </Card>
                </Grid>
    </>
    )
}

export default observer(DocumentPreviewCard);

