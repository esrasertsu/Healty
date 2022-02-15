import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {  Icon } from 'semantic-ui-react'
import { IDocument } from '../../models/profile'

interface IProps{
    setFiles: (files: object[]) => void;
    setDocuments: (files: object[]) => void;
    setUpdateEnabled: (enable: boolean) => void;

}

const dropzoneStyles ={
    border: 'dashed 1px',
    borderColor: '#eee',
    borderRadius: '5px',
    display: 'flex',
    textAlign: 'center' as 'center',
    height: '100%'
}

const dropzoneActive = {
    borderColor: 'green'
}

const FileUploadDropzone: React.FC<IProps> = ({setFiles,setDocuments, setUpdateEnabled}) => {

  const onDrop = useCallback(acceptedFiles => {
    setDocuments(acceptedFiles);
    setUpdateEnabled(true);
    setFiles(acceptedFiles.map((file:any) => Object.assign(file, 
        {
            preview : URL.createObjectURL(file)
        })
        ));

  }, [setFiles,setDocuments])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

  return (
    
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyles, ...dropzoneActive}: dropzoneStyles}>
      <input {...getInputProps()} />
      <div className="docAvatarAddWrapper circleAvatar">
            <Icon name="add circle" className='addTwoTone' />
       </div>
    </div>

    
  )
}

export default FileUploadDropzone;