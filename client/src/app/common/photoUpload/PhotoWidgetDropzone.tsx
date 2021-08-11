import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Crop } from 'react-image-crop'
import { Header, Icon } from 'semantic-ui-react'

interface IProps{
    setFiles: (files: File[]) => void;
}

const dropzoneStyles ={
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    textAlign: 'center' as 'center',
    height: '300px',
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    cursor:"pointer"
}

const dropzoneActive = {
    borderColor: 'green'
}

const PhotoWidgetDropzone: React.FC<IProps> = ({setFiles}) => {

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map((file:object) => Object.assign(file, 
        {
            preview : URL.createObjectURL(file)
        })
        ));

  }, [setFiles])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

  return (
    
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyles, ...dropzoneActive}: dropzoneStyles}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Resmi buraya sürükleyin ya da tıklayın.' />
    </div>
  )
}

export default PhotoWidgetDropzone;