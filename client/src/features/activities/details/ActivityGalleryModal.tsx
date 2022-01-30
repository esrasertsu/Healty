import React, { Component, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface IProps{
    currentImageIndex:number;
    images:any;
    onClose:() => void;
}

const ActivityGalleryModal: React.FC<IProps> = ({currentImageIndex,images,onClose}) => {

    const [imageIndex, setimageIndex] = useState(currentImageIndex)
   
    const onMovePrevRequest = () =>{
        setimageIndex((imageIndex + images.length - 1) % images.length);
    }

    const onMoveNextRequest = () =>{
        setimageIndex((imageIndex + 1) % images.length);
    }

      return (
        <Lightbox
          mainSrc={images[imageIndex].url}
          nextSrc={ images[(imageIndex + 1) % images.length].url}
          prevSrc={
           images[(imageIndex + images.length - 1) % images.length].url
          }
          onCloseRequest={onClose}
          onMovePrevRequest={onMovePrevRequest}
          onMoveNextRequest={onMoveNextRequest}
        />
      );
    
  }
  
  export default ActivityGalleryModal;
  
