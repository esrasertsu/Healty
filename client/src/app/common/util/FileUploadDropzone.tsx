import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react'

interface IProps{
    setFiles: (files: object[]) => void;
    setDocuments: (files: object[]) => void;
    setUpdateEnabled: (enable: boolean) => void;
}

const dropzoneStyles ={
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
}

const dropzoneActive = {
    borderColor: 'green'
}

const FileUploadDropzone: React.FC<IProps> = ({setFiles,setDocuments, setUpdateEnabled}) => {

  const onDrop = useCallback(acceptedFiles => {
    setDocuments(acceptedFiles);
    setUpdateEnabled(true);
    setFiles(acceptedFiles.map((file:object) => Object.assign(file, 
        {
            preview : URL.createObjectURL(file)
        })
        ));

  }, [setFiles,setDocuments])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: true})

  return (
    
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyles, ...dropzoneActive}: dropzoneStyles}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Dosyaları buraya sürükleyin ya da tıklayın.' />
    </div>
  )
}

export default FileUploadDropzone;