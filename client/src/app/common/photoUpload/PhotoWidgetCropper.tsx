import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import ReactCrop, { Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

interface IProps{
    setImage: (file: Blob) => void;
    setImageDeleted:(change: boolean) => void;
    setImageChanged:(change: boolean) => void;
    imagePreview: string;
    setCroppedImageUrl: (url: string) => void;
    setOriginalImage:(file: Blob) => void;
    aspect:number;
    maxHeight:number;
}

 const PhotoWidgetCropper:React.FC<IProps> = ({setImage,setImageDeleted,setImageChanged, imagePreview, setCroppedImageUrl, aspect,setOriginalImage,maxHeight}) =>  {

    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        aspect:aspect,
        width:100,
        height:100
    });

    const [originalWidth, setoriginalWidth] = useState(0);

    const [imageRef, setImageRef] = useState<any>();
    const [newImage, setNewImage] = useState<boolean>(false);

    const handleImageLoaded = (image:any) => {
        setNewImage(true);
        setImageRef(image);
        setCroppedImageUrl(imagePreview);
    };

      
    const handleCropComplete = (crop:Crop) => {
        if(newImage && crop.width && crop.width>0)
            setoriginalWidth(crop.width);
        
         if(crop.width === 0) 
           crop.width = originalWidth;   

        if(crop.width && crop.height && crop.aspect)
           crop.height = crop.width! / crop.aspect!;

           
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
                if(newImage) setOriginalImage(blob);
                setImage(blob);
                setImageDeleted(false);
                setImageChanged(true);
                setNewImage(false);
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
        if(crop.width && crop.width>0 && crop.height && crop.height>0)
        setCrop(crop);
    
    };

    useEffect(() => {
        makeClientCrop(crop);
    }, [imageRef]);

    return (
        <ReactCrop
            src={imagePreview}
            style={{ maxHeight:"100%"}}
            crop={crop}
            ruleOfThirds
            onImageLoaded={handleImageLoaded}
            onComplete={handleCropComplete}
            onChange={handleCropChange}
      />
    )
}

export default observer(PhotoWidgetCropper);

