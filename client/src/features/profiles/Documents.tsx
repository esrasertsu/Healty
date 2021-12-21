import {
    Button,
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    Avatar,
    Tooltip,
    CardActionArea,
    Container
  } from '@material-ui/core';
  
  import { styled } from '@material-ui/core/styles';
import { AddTwoTone } from '@material-ui/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { Popup } from 'semantic-ui-react';
import FileUploadDropzone from '../../app/common/util/FileUploadDropzone';
import { IDocument } from '../../app/models/profile';
import  DocumentPreviewCard from './DocumentPreviewCard';

  interface IProps{
    docs?: IDocument[];
    setFiles: (files: object[]) => void;
    setDocuments: (files: object[]) => void;
    setUpdateEnabled: (enable: boolean) => void;
  }


  const Documents:React.FC<IProps> = ({ docs,setFiles,setDocuments, setUpdateEnabled }) => {
  debugger;
    return (
      <>
         <Grid container spacing={3}>
             {docs!.map((document) => 
               ( <DocumentPreviewCard document={document} />)
             )}
            <Grid xs={12} sm={6} md={3} item>
            <Popup 
                hoverable
                on={['hover', 'click']}
                positionFixed 
                size='large' 
                trigger={
                    <Card className="docCardAddAction">
                    <CardActionArea>
                      <CardContent>
                      <FileUploadDropzone setDocuments={setDocuments} setFiles={setFiles} setUpdateEnabled={setUpdateEnabled} />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                } 
                name="info circle" >
                  <Popup.Content>
                    <div style={{fontSize:"14px"}}>Belge eklemek için tıklayın.</div>
                  </Popup.Content>
                </Popup>
            
          </Grid>
        </Grid>
      </>
    );
  }
  
  export default observer(Documents);
  