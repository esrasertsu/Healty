import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import ReactCrop, { Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

interface IProps{
    setImage: (file: Blob) => void;
    imagePreview: string;
    setCroppedImageUrl: (url: string) => void;
}

 const PhotoWidgetCropper:React.FC<IProps> = ({setImage, imagePreview, setCroppedImageUrl}) =>  {

    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        aspect:1,
        width:100
    });

    const [imageRef, setImageRef] = useState<any>();

    
    const handleImageLoaded = (image:any) => {
        setImageRef(image);
        setCroppedImageUrl(imagePreview);
    };

      
    const handleCropComplete = (crop:Crop) => {
        makeClientCrop(crop);
    };

    const makeClientCrop = async (crop:Crop) =>{
        if(imageRef && crop.width && crop.height)
        {
            const canvas = getCroppedImg(
                imageRef,
                crop,
                'newFile.jpeg'
            );
            
            setCroppedImageUrl(canvas.toDataURL('image/jpeg'));
            canvas.toBlob((blob: Blob | null) => {
                if (!blob) {
                  //reject(new Error('Canvas is empty'));
                  console.error('Canvas is empty');
                  return;
                }
                setImage(blob)
              }, 'image/jpeg');
        } 
    }

    const getCroppedImg = (image:any, crop:any, fileName:string) =>{
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width!!;
        canvas.height = crop.height!!;
        const ctx = canvas.getContext('2d')!!;
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
        return canvas;
     
    }

    const handleCropChange = (crop:Crop) => {
        setCrop(crop);
    };

    return (
        <ReactCrop
            src={imagePreview}
            style={{  maxWidth: "100%", height:"100%", maxHeight:"200"}}
            crop={crop}
            ruleOfThirds
            onImageLoaded={handleImageLoaded}
            onComplete={handleCropComplete}
            onChange={handleCropChange}
      />
    )
}

export default observer(PhotoWidgetCropper);

