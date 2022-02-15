import React, { useState } from 'react'
import { observer } from 'mobx-react';
import { IDocument } from '../../app/models/profile';
import { Button, Card, CardContent, Confirm, Grid, Icon, Image } from 'semantic-ui-react';
interface IProps{
      document:IDocument;
      deleteDocument: (photo:IDocument) => void;

  }


const DocumentPreviewCard:React.FC<IProps> = ({document,deleteDocument}) => {


const [openDelete, setOpenDelete] = useState(false);

   
      const handleCloseDelete = () => {
        setOpenDelete(false);
      };
      const handleOpenDelete = () => {
        setOpenDelete(true);
      };

      const deleteDoc = () => {
        deleteDocument(document); 
        handleCloseDelete();
      };

    return (
        <>
       
      <Confirm
          content='Bu belgeyi silmek istediğine emin misin?'
          open={openDelete}
          header="Sil"
          cancelButton='İptal'
          confirmButton="Sil"
          onCancel={handleCloseDelete}
          onConfirm={deleteDoc}
        />

                <Grid.Column key={document.id+"grid"}>
                    <Card className='photoPreview' key={document.id + "_card"}>
                      <Image 
                      key={document.id + "_cardMedia"}
                     src={document.url} 
                     wrapped 
                     ui={false} 
                     target = "_blank"
                     onError={(e:any) => {
                          e.target.src = "/assets/empty-image.png";
                        }} />
                   
                    <CardContent key={document.url + "_cardActions"}>
                    <Button basic type="button" key={document.url + "_saveBtn"} animated='vertical' target="_blank" aria-label="İndir" href={document.url} download >
                      <Button.Content hidden>İndir</Button.Content>
                      <Button.Content visible>
                        <Icon name="download" />
                      </Button.Content>
                    </Button>
                 
                    
                      <Button basic color="red" type="button" key={document.url + "_delBtn"} animated='vertical' onClick={handleOpenDelete} >
                      <Button.Content hidden>Sil</Button.Content>
                      <Button.Content visible>
                        <Icon name="trash alternate outline" />
                      </Button.Content>
                    </Button>
                    
                </CardContent>
                    </Card>
        </Grid.Column>
    </>
    )
}

export default observer(DocumentPreviewCard);

