import { observer } from 'mobx-react';
import React from 'react';
import { Card,  Grid, Popup } from 'semantic-ui-react';
import FileUploadDropzone from '../../app/common/util/FileUploadDropzone';
import { IDocument } from '../../app/models/profile';
import  DocumentPreviewCard from './DocumentPreviewCard';

  interface IProps{
    docs?: IDocument[];
    setFiles: (files: object[]) => void;
    setDocuments: (files: object[]) => void;
    setUpdateEnabled: (enable: boolean) => void;
    deleteDocument: (photo:IDocument) => void;

  }


  const Documents:React.FC<IProps> = ({ docs,setFiles,setDocuments, setUpdateEnabled,deleteDocument }) => {
    return (
      <>
         <Grid columns={4} stackable>
             {docs!.map((document) => 
               ( <DocumentPreviewCard key={document.id+"_documentPreviewCard"} document={document}  deleteDocument={deleteDocument}/>)
             )}
            <Grid.Column>
            <Popup 
                hoverable
                on={['hover', 'click']}
                positionFixed 
                size='large' 
                trigger={
                    <Card className="docCardAddAction">
                    
                      <Card.Content>
                      <FileUploadDropzone setDocuments={setDocuments} setFiles={setFiles} setUpdateEnabled={setUpdateEnabled}
                      />
                      </Card.Content>
                  </Card>
                } 
                name="info circle" >
                  <Popup.Content>
                    <div style={{fontSize:"14px"}}>Belge eklemek için tıklayın.</div>
                  </Popup.Content>
                </Popup>
            
          </Grid.Column>
        </Grid>
      </>
    );
  }
  
  export default observer(Documents);
  