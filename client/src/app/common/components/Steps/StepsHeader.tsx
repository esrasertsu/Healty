import React, { FC, ReactNode } from 'react'
import "./StepComponent.scss";

interface IProps{
    children?: ReactNode;
}
export const StepsHeader:FC<IProps> = (
    {
        children,
  ...rest
    }
) => {


  return (
     <div className="steps" id="steps" {...rest}>
         {children}
    </div>
  )
}

  
