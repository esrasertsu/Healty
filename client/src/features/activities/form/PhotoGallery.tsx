import { observer } from 'mobx-react';
import React from 'react';
import { Card, Grid, Popup } from 'semantic-ui-react';
import FileUploadDropzone from '../../../app/common/util/FileUploadDropzone';
import { IPhoto } from '../../../app/models/profile';
import PhotoPreviewCard from './PhotoPreviewCard';

  interface IProps{
    docs?: IPhoto[];
    setFiles: (files: object[]) => void;
    setDocuments: (files: object[]) => void;
    setUpdateEnabled: (enable: boolean) => void;
    deleteActivityPhoto: (photo:IPhoto) => void;
    makeCoverPic? : (photo:IPhoto) => void;
    newMainId: string;

  }


  const PhotoGallery:React.FC<IProps> = ({ docs,setFiles,setDocuments, setUpdateEnabled,deleteActivityPhoto,makeCoverPic,newMainId }) => {
    return (
      <>
         <Grid stackable columns={4}>
             {docs && docs.map((document) => 
               ( <PhotoPreviewCard key={document.url} photo={document} deleteActivityPhoto={deleteActivityPhoto} makeCoverPic={makeCoverPic}
                newMainId={newMainId}/>)
             )}
            <Grid.Column >
            <Popup 
                hoverable
                on={['hover', 'click']}
                positionFixed 
                size='large' 
                trigger={
                  <Card className="docCardAddAction">
                      <Card.Content>
                      <FileUploadDropzone setDocuments={setDocuments} setFiles={setFiles} setUpdateEnabled={setUpdateEnabled} />
                      </Card.Content>
                  </Card>
                    
                } 
                name="info circle" >
                  <Popup.Content>
                    <div style={{fontSize:"14px"}}>Görsel eklemek için tıklayın.</div>
                  </Popup.Content>
                </Popup>
            
          </Grid.Column>
        </Grid>
      </>
    );
  }
  
  export default observer(PhotoGallery);
  